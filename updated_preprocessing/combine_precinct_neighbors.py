import json
from os import listdir
from os.path import isfile, join
import sys

def combine_neighbor_files(stateInitials):
    files = [f for f in listdir(".") if isfile(join(".", f)) and f"neighbors_{stateInitials}" in f]

    deduped = {}
    for filename in files:
        with open(filename, "r+") as f:
            curr = json.load(f)
        for prec, neighbors in curr.items():
            if deduped.get(prec, None) is None:
                deduped[prec] = set()
            deduped[prec].update(neighbors)

    deduped = {pId: list(s) for pId, s in deduped.items()}
    return deduped

def main(args):
    if (len(args) < 2):
        print("Please supply state initials e.g. 'RI'")
        exit(1)
    neighbors = combine_neighbor_files(args[1])
    with open(f"precinct_neighbors_{args[1]}.json", "w") as f:
        json.dump(neighbors, f)


if __name__ == "__main__":
    main(sys.argv)