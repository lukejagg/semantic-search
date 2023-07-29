# Learning-to-Rank training
# Author: Lucas Jaggernauth
import random
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from rank_net import RankNet, ranknet_loss

model = RankNet(1539)  # 768 * 2 + 3
optimizer = torch.optim.Adam(model.parameters(), lr=0.0001)

# read pickle in ../backend/logging/clicks
import os
import pickle
logs = []
for filename in os.listdir('../backend/logging/clicks'):
    with open('../backend/logging/clicks/' + filename, 'rb') as f:
        logs.append(pickle.load(f))

def create_data(data, use_correct_result=True):
    results = data['results']
    correct_result = None
    # If correct_result is not in results, choose random result
    if use_correct_result:
        for result in results:
            if result['link'] == data['link']:
                correct_result = result
                break
    else:
        # Choose random result that isn't the correct result
        # If there is only one result, return None
        if len(results) == 1:
            return None

        import random
        correct_result = random.choice(results)
        while correct_result['link'] == data['link']:
            correct_result = random.choice(results)

    if correct_result is None:
        return None
    if correct_result['embedding'] is None:
        correct_result['embedding'] = np.zeros(768)
    values = [data['query_embedding'], correct_result['embedding'], [correct_result['score']], [correct_result['tf_idf_score'] or 0], [correct_result['cosine_score'] or 0]]
    values = [torch.tensor(value) for value in values]
    # set dtype to float32

    return torch.cat(list(values)).float()


class RankNetDataset(Dataset):
    def __init__(self, logs):
        self.logs = logs

    def __len__(self):
        return len(self.logs) * 5

    def __getitem__(self, idx):
        # random index in self.logs (ignore idx)
        data = random.choice(self.logs)
        true_data = create_data(data, True)
        false_data = create_data(data, False)
        while true_data is None or false_data is None:
            data = random.choice(self.logs)
            true_data = create_data(data, True)
            false_data = create_data(data, False)
        return true_data, false_data


dataset = RankNetDataset(logs)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

# Assume X1, X2, and labels are your data
# X1, X2 are batches of your feature vectors for document 1 and document 2
# labels are batches of {0, 1} where 1 if document 1 is more relevant than document 2, and 0 otherwise
for epoch in range(1000):  # number of epochs
    avg_loss = 0
    for X1, X2 in dataloader:
        optimizer.zero_grad()

        s1, s2 = model(X1, X2)
        loss = ranknet_loss(s1, s2)

        loss.backward()
        optimizer.step()
        avg_loss += loss.item()

    print(avg_loss / len(dataloader))

# Save model
torch.save(model.state_dict(), '../backend/search/model.pt')
