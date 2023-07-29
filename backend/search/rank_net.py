import torch
import torch.nn as nn

class RankNet(nn.Module):
    def __init__(self, input_size):
        super(RankNet, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
        )

    def forward(self, x1, x2):
        s1 = self.fc(x1)
        s2 = self.fc(x2)
        return s1, s2

    def inference(self, x1):
        s1 = self.fc(x1)
        return s1


def ranknet_loss(s1, s2, label=1):
    diff = s1 - s2
    return -torch.mean(nn.functional.logsigmoid(label * diff))