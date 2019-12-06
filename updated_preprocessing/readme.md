# Install
## Windows
```
py -3 -m venv venv
.\venv\Scripts\activate.bat OR .\venv\Scripts\Activate.ps1
pip install Shapely-1.6.4.post2-cp37-cp37m-win_amd64.whl
pip install -r requirements.txt
```

## *Nix/Mac
```
python3 -m venv venv
source venv/bin/activate
pip install shapely[vectorized] -r requirements.txt
```

# Usage
`python precinct_adjacency.py <num_threads> <search_spaces_file_prefix> <state> <write_search_spaces_file>`

#### If you don't have a search spaces file yet

`python precinct_adjacency.py 8 search_space RI 1`

#### If you have the file already

`python .\precinct_adjacency.py 8 search_space RI 0`