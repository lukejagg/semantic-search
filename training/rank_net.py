import torch
import torch.nn as nn

class RankNet(nn.Module):
    def __init__(self, input_size):
        super(RankNet, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.GELU(),
            nn.BatchNorm1d(128),
            nn.Linear(128, 64),
            nn.GELU(),
            nn.BatchNorm1d(64),
            nn.Linear(64, 32),
            nn.GELU(),
            nn.BatchNorm1d(32),
            nn.Linear(32, 1),
        )
        # initialize weights
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                nn.init.zeros_(m.bias)

    def forward(self, x1, x2):
        s1 = self.fc(x1)
        s2 = self.fc(x2)
        return s1, s2


def ranknet_loss(s1, s2, label=1):
    diff = s1 - s2
    return -torch.mean(nn.functional.logsigmoid(label * diff))