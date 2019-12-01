import json
from shapely.geometry import shape, Polygon, LineString, GeometryCollection, MultiPolygon
from shapely.ops import split, shared_paths, cascaded_union
import math
import numpy as np
import pandas as pd
from scipy.spatial import distance
import matplotlib.pyplot as plt
from pyproj import Geod

"""
Create a grid G that divides a set of precincts into a reasonable number of sections.
@param: The list of precincts.
@return: The grid.
"""
def __create_grid(precincts):
    bounds_min = [math.inf, math.inf]
    bounds_max = [-math.inf, -math.inf]

    # find min and max bounds of state
    for p in precincts:
        # p.bounds returns (minx, miny, maxx, maxy) tuple that bounds precinct
        b_min = p.bounds[:2]
        b_max = p.bounds[2:]
        for i in range(len(bounds_min)):
            if b_min[i] < bounds_min[i]:
                bounds_min[i] = b_min[i]
            if b_max[i] > bounds_max[i]:
                bounds_max[i] = b_max[i]

    bounds = bounds_min
    bounds.extend(bounds_max) # bounds -- 4 coordinates of a rectangle that encompasses the entire state
    #print('state grid bounds: ', bounds)

    x_coor = [bounds[i] for i in range(0,4,2)]
    y_coor = [bounds[j] for j in range(1,4,2)]
    coor = [] # [(minx, miny), (minx, maxy), (maxx, miny), (maxx, maxy)]

    # get coordinate bounds of grid
    for x in x_coor:
        for y in y_coor:
            coor.append([x,y])
    #print('grid rectangular coordinates: ', coor)

    outline = Polygon(coor).convex_hull
    #print('grid rectangular outline: ', outline)

    # get length (x distance) and width (y distance) and divide by 5 (some number to get appropriate number of boxes)?
    #print(list(outline.exterior.coords))
    coor = list(outline.exterior.coords)

    n = 4 # some random number that will probably change later
    length = distance.euclidean(coor[1], coor[2])/n
    width = distance.euclidean(coor[0], coor[1])/n
    #print('length: ', length, '\twidth: ', width, '\n')

    min_x = outline.bounds[0]
    min_y = outline.bounds[1]
    max_x = outline.bounds[2]
    max_y = outline.bounds[3]

    x = min_x
    lengthwise_split = []
    poly = outline
    for i in range(n-1): # 4 lines to split shape in 5
        x += length
        line = LineString([(x,min_y), (x,max_y)])
        res = split(poly, line)
        if res[0].area < res[1].area:
            lengthwise_split.append(res[0]) # the 'smaller' rectangle
            poly = res[1] # the remainder that will be split on in future iterations
        else:
            lengthwise_split.append(res[1])
            poly = res[0]
    lengthwise_split.append(poly)

    grid = []
    for rect in lengthwise_split:
        y = min_y
        poly = rect
        for i in range(n-1): # n=5, 0 to 3, inclusive --> 4 times
            #print('unsplit rect: ', poly)
            y += width
            line = LineString([(min_x, y), (max_x, y)])
            res = split(poly, line)
            #print('line: ', line)
            #print('\tresult: ', res)
            if res[0].area < res[1].area:
                grid.append(res[0]) # the search box -- the smaller area
                poly = res[1] # the remainder
            else:
                grid.append(res[1])
                poly = res[0]
        grid.append(poly) # the final search box of the rectangle

    return grid



"""
@param precincts: A list of all the precincts in the state.
@return: A dictionary,  where the keys are precincts (as a tuple) 
        and the values are each precinct's search space (a list of tuples).
"""
def __compute_search_spaces(precincts):
    grid = __create_grid(precincts)

    for box in grid:
        x,y = box.exterior.xy
        plt.plot(x,y,'black')
    plt.show()

    b_precincts = dict() # dictionary containing each box's set of precincts; key = box
    p_boxes = dict() # dictionary containing each precinct's set of boxes; key = precinct
    for box in grid:
        for p in precincts:
            b = tuple(box.exterior.coords) # list of tuple coordinates
            if box.intersects(p): # box is a polygon; p is a polygon
                # add p to box's set of precincts
                val = b_precincts.get(b) # box's set of precincts
                p_coords = tuple(p.exterior.coords)
                if val == None:
                    val = set()
                val.add(p_coords)
                b_precincts[b] = val

                # add box to p's set of boxes
                val = p_boxes.get(p_coords) # p's set of boxes
                if val == None:
                    val = set()
                val.add(b)
                p_boxes[p_coords] = val

    search_space = dict() # key = precinct; val = set of precincts to search
    for p in precincts:
        p_coords = tuple(p.exterior.coords)
        for box in p_boxes[p_coords]:
            # add all precincts p2 in box's set of of precincts to p's search space
            p2 = b_precincts.get(tuple(box)) # set of precincts in box
            if search_space.get(p_coords) == None:
                search_space[p_coords] = p2.difference({p_coords})
            else:
                pre_list = p2.union(search_space[p_coords]).difference({p_coords})
                search_space[p_coords] = pre_list

    return search_space


"""
@param precinct1: The precinct to merge.
@param precinct2: The precinct to merge. Also the precinct that will be removed.
@return: The merged precinct.
"""
def __merge_and_drop(precinct1, precinct2):
    # in the case of enclosed precincts, don't need to fix search space
    # need to change geojson file
    pass


"""
Checks if two precincts share a border.
@return: True if the precincts share a border. False, otherwise.
"""
def share_border(precinct1, precinct2):
    if not precinct1.intersects(precinct2): # boundary and interior doesn't intersect in any way
        return False

    l1 = [] # all line segments in p1's border
    l2 = [] # al line segments in p2's border
    lines1 = tuple(precinct1.exterior.coords) # tuple of p1 coordinates
    lines2 = tuple(precinct2.exterior.coords) # tuple of p2 coordinates

    # break precinct Polygon into individual LineString line segments
    for i in range(len(lines1)-1):
        line_segment = LineString([lines1[i], lines1[i+1]])
        l1.append(line_segment)
    for i in range(len(lines2)-1):
        line_segment = LineString([lines2[i], lines2[i+1]])
        l2.append(line_segment)

    # check for shared paths
    # note: coordinates order is longitude latitude
    geo = Geod(ellps='GRS80')
    epsilon = 100*0.3048 # 100 ft = 30.48 meters
    intersection_pts = set()
    for line1 in l1:
        for line2 in l2:
            sp = shared_paths(line1, line2)
            if sp: # check sp is not empty
                dst = geo.geometry_length(sp) # in meters
                if dst >= epsilon:
                    return True
            else: # segments intersects but don't share border -- should be 100 ft
                pt = line1.intersection(line2) # should be point
                if pt: # check pt is not empty
                    coords = pt.coords[0]
                    intersection_pts.add(coords)

    # no shared paths at all -- might be due to overlap or just a single point touching
    if len(intersection_pts) > 1:
        line = LineString(list(intersection_pts))
        dst = geo.geometry_length(line)
        #print('dst: ', dst)
        if dst >= epsilon:
            return True

    return False


"""
@param precincts: The list of all precincts.
@param precinct: The precinct whose neighbors you want to find.
@return: The list of neighboring precincts.
"""
def get_precinct_neighbors(precinct, grid):
    neighbors = []
    search_space = grid[tuple(precinct.exterior.coords)]

    for p in search_space:
        # enclosed precincts -- merge the precincts and drop enclosed precinct
        p = Polygon(p)
        if precinct.contains(p):
            # __merge_and_drop(precinct, p)
            pass

        #if precincts share a border
        if share_border(precinct, p):
            neighbors.append(p)

    return neighbors


"""
Use case 18: Determine if adjoining precincts are in different counties.
Note: 5 counties of RI
@param precinct1
@param precinct2
"""
def different_counties(precinct1, precinct2):
    pass

"""
Coverts a list that contains Polygons/Multipolgyons into a list that only contains Polygons.
@param collection: List of geometric objects that include Polygons and MultiPolygons
@return: A list of Polygons
"""
def __all_polygons(collection):
    new_collection = []
    for poly in collection:
        if isinstance(poly, MultiPolygon):
            for p in poly:
                new_collection.append(p)
        else:
            new_collection.append(poly)
    return new_collection


# need to use all small polygons for multipolgyons -- need a mapping btw multipolgyons and res polgons
# then merge their resulting search space?


"""
Plots the polygons and labels them in order listed
@param polygons: List of polygons to be plotted
"""
def plot_polygons(polygons):
    if len(polygons)>1:
        count = 1
        for p in polygons:
            plot(p)
            c = p.centroid.coords
            plt.text(c[0][0], c[0][1], s=str(count))
            count += 1
    else:
        plot(polygons[0])


def plot(poly, color='r'):
    x, y = poly.exterior.xy
    plt.plot(x, y, color)


def __run(filename):
    with open(filename) as file:
        data = json.load(file)

    features = data['features'] # list of dictionaries, with each dictionary containing info on geometry
    collection = GeometryCollection([shape(feature['geometry']).buffer(0) for feature in features]) # geometry of each precinct
    collection = __all_polygons(collection)
    # plot rhode island
    plot_polygons(collection)
    grid = __compute_search_spaces(collection)
    for poly in collection:
        neighbors = get_precinct_neighbors(collection, poly, grid)
        for n in neighbors:
            print(n)
        print()


def __get_county(data, county_name):
    county_data = []
    geometries = []
    for feature in data['features']:
        name = feature['properties']['PRENAME']
        if county_name in name:
            county_data.append(feature)
            geometries.append(shape(feature['geometry']))
    return county_data, geometries


def update_NC(file, data, votes16, votes18):
    
    # CARTERET
    name = 'CARTERET'
    precincts = ['CARTERET CDIS']
    comp = [['CISL']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # CHEROKEE
    name = 'CHEROKEE'
    precincts = ['CHEROKEE BEAV', 'CHEROKEE NOTL']
    comp = [['UNKA', 'GCRK'], ['CSON', 'RGER']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # CLEVELAND
    name = 'CLEVELAND'
    precincts = ['CLEVELAND S5', 'CLEVELAND OAKGR']
    comp = [['S 5'], ['OAKGRV']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    """
    # COLUMBUS -- problem with NaN
    name = 'COLUMBUS'
    precincts = ['COLUMBUS P16', 'COLUMBUS P01', 'COLUMBUS P26', 'COLUMBUS P20',
                 'COLUMBUS P22', 'COLUMBUS P25', 'COLUMBUS P02']
    comp = [['P16B'], ['P01A'], ['P26B'], ['P20A'], ['P22A'], ['P25B'], ['P02B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)
    """

    # DAVIDSON
    name = 'DAVIDSON'
    precincts = ['DAVIDSON 02', 'DAVIDSON 80']
    comp = [['86A', '88'], ['80A']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # DUPLIN
    name = 'DUPLIN'
    precincts = ['DUPLIN CYRK']
    comp = [['CYCK']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # DURHAM
    name = 'DURHAM'
    precincts = ['DURHAM 35', 'DURHAM 34', 'DURHAM 55']
    comp = [['35.3'], ['34-1', '34-2'], ['55-11 ', '55-49']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # GREENE
    name = 'GREENE'
    precincts = ['GREENE SH1']
    comp = [['SH#1']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    """
    # GUILFORD -- problem with NaN
    name = 'GUILFORD'
    precincts = ['GUILFORD HP', 'GUILFORD G42', 'GUILFORD G41', 'GUILFORD FR5', 'GUILFORD MON2', 'GUILFORD H27']
    comp = [['H28', 'H29A', 'H29B'], ['G42A', 'G42B'], ['G41A', 'G41B'],
            ['FR5A', 'FR5B'], ['MON2A', 'MON2B'], ['H27-A', 'H27-B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)
    """

    # HALIFAX
    name = 'HALIFAX'
    precincts = ['HALIFAX ENF 2', 'HALIFAX LIT 1', 'HALIFAX LIT 2', 'HALIFAX RR 10',
                 'HALIFAX RR 11', 'HALIFAX RR 3', 'HALIFAX RR 4', 'HALIFAX RR 5',
                 'HALIFAX RR 7', 'HALIFAX RR 9', 'HALIFAX WEL 3']
    comp = [[p[len(name)+1:]] for p in precincts]
    data = update_all(name, data, votes16, votes18, precincts, comp)
    
    # HARNETT
    name = 'HARNETT'
    precincts = ['HARNETT PR17', 'HARNETT PR27']
    comp = [['PR31'], ['PR32']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # HOKE
    name = 'HOKE'
    precincts = ['HOKE 06']
    comp = [['14', '15', '6B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # JACKSON
    name = 'JACKSON'
    precincts = ['JACKSON HAMMNT', 'JACKSON ALLSC', 'JACKSON SYLDIL']
    comp = [['GLV'], ['SCC'], ['SSW', 'SND']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # JOHNSTON
    name = 'JOHNSTON'
    precincts = ['JOHNSTON PR27', 'JOHNSTON PR10', 'JOHNSTON P12', 'JOHNSTON PR23']
    comp = [['PR27A', 'PR27B'], ['PR10A', 'PR10B'], ['PR12A', 'PR12B'], ['PR23A', 'PR23B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # LEE
    name = 'LEE'
    precincts = ['LEE B', 'LEE D', 'LEE E', 'LEE A', 'LEE C']
    comp = [['B1', 'B2'], ['D1', 'D2'], ['E1', 'E2'], ['A1', 'A2'], ['C1', 'C2']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # MCDOWELL
    name = 'MCDOWELL'
    precincts = ['MCDOWELL MAR-5', 'MCDOWELL FORT-1', 'MCDOWELL MAR-1', 'MCDOWELL MAR-4',
                 'MCDOWELL MAR-3', 'MCDOWELL WEST-M', 'MCDOWELL FORT-2', 'MCDOWELL MAR-2']
    comp = [['5-MAR'], ['FORT 1'], ['1-MAR'], ['4-MAR'], ['3-MAR'], ['WEST M'], ['FORT 2'], ['2-MAR']]
    data = update_all(name, data, votes16, votes18, precincts, comp)
    
    # MADISON
    name = 'MADISON'
    precincts = ['MADISON EBBS-C', 'MADISON MARS-H', 'MADISON HOT-SP']
    comp = [['EBBS C'], ['MARS H'], ['HOT SP']]
    data = update_all(name, data, votes16, votes18, precincts, comp)
    
    # MOORE
    name = 'MOORE'
    precincts = ['MOORE PHA', 'MOORE EUR', 'MOORE KWD']
    comp = [['PHA1', 'PHA2'], ['EUR-WP'], ['WKWD', 'EKWD']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # NASH
    name = 'NASH'
    precincts = ['NASH 0007', 'NASH 0022', 'NASH 0041', 'NASH 0021', 'NASH 0026',
                 'NASH 0036', 'NASH 0003', 'NASH 0038', 'NASH 0015', 'NASH 0035',
                 'NASH 0025', 'NASH 0012', 'NASH 0004', 'NASH 0008', 'NASH 0033',
                 'NASH 0034', 'NASH 0011', 'NASH 0006', 'NASH 0001']
    comp = [['P10A'], ['P12A'], ['P14A'], ['P13A'], ['P02A'], ['P11A'], ['P20A'],
            ['P09A'], ['P18A'], ['P08A'], ['P24A'], ['P15A'], ['P07A'], ['P05A'],
            ['P04A'], ['P22A'], ['P23A'], ['P06A'], ['P03A'], ['P01A']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # NEW HANOVER
    name = 'NEW HANOVER'
    precincts = ['NEW HANOVER CF02', 'NEW HANOVER FP03', 'NEW HANOVER CF01', 'NEW HANOVER W30',
                 'NEW HANOVER M03', 'NEW HANOVER H07', 'NEW HANOVER H09', 'NEW HANOVER WB', 'NEW HANOVER FP01',
                 'NEW HANOVER M04', 'NEW HANOVER FP04', 'NEW HANOVER W17', 'NEW HANOVER CF03',
                 'NEW HANOVER H06', 'NEW HANOVER W25', 'NEW HANOVER W08', 'NEW HANOVER W15', 'NEW HANOVER W29',
                 'NEW HANOVER W03', 'NEW HANOVER W26', 'NEW HANOVER 31', 'NEW HANOVER H01', 'NEW HANOVER 04',
                 'NEW HANOVER W12', 'NEW HANOVER H08', 'NEW HANOVER W28', 'NEW HANOVER H02', 'NEW HANOVER W13',
                 'NEW HANOVER H05', 'NEW HANOVER W24', 'NEW HANOVER W18', 'NEW HANOVER 21', 'NEW HANOVER H03',
                 'NEW HANOVER W16']
    comp = [['CF02'], ['FP03'], ['CF01'], ['W30'], ['M03'], ['H10', 'H11'], ['H12', 'H13'], ['WB'],
            ['FP06', 'FP07'], ['M04'], ['FP04'], ['W17'], ['CF05', 'CF06'], ['H06'], ['W25'], ['W08'], ['W15'], ['W29'],
            ['W03'], ['W26'], ['31'], ['NH01'], ['04'], ['W12'], ['H08'], ['W28'], ['H02'], ['W13'],
            ['H05'], ['W24'], ['W18'], ['21'], ['NH03'], ['W16']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # NORTHAMPTON
    name = 'NORTHAMPTON'
    precincts = ['NORTHAMPTON LAKE G', 'NORTHAMPTON RICH S']
    comp = [[p[len(name)+1:]] for p in precincts]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # ONSLOW
    name = 'ONSLOW'
    precincts = ['ONSLOW NE22']
    comp = [['NE22A', 'NE22B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # PAMLICO
    name = 'PAMLICO'
    precincts = ['PAMLICO 4VM', 'PAMLICO 1AL']
    comp = [['4VM A', '4MSIC'], ['1GB']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # PERQUIMANS
    name = 'PERQUIMANS'
    precincts = ['PERQUIMANS EAST H', 'PERQUIMANS WEST H', 'PERQUIMANS NEW HO']
    comp = [['EAST H'], ['WEST H'], ['NEW HO']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # PITT
    name = 'PITT'
    precincts = ['PITT 1403A', 'PITT 1504', 'PITT 1402A', 'PITT 1402B']
    comp = [['1403A1', '1403A2'], ['1504A', '1504B'], ['1513A'], ['1513B']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # RANDOLPH
    name = 'RANDOLPH'
    precincts = ['RANDOLPH 22', 'RANDOLPH 31', 'RANDOLPH 36', 'RANDOLPH 13',
                 'RANDOLPH 35', 'RANDOLPH 23', 'RANDOLPH 38']
    comp = [['LC'], ['RM'], ['TB'], ['BC'], ['ST'], ['LB'], ['TT']]

    # UNION
    name = 'UNION'
    precincts = ['UNION 028']
    comp = [['28A', '28B', '28C', '28D']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    # YANCEY
    name = 'YANCEY'
    precincts = ['YANCEY 05 GRE', 'YANCEY 03 EGY', 'YANCEY 07 BRU', 'YANCEY 06 JAC', 'YANCEY 02 CAN', 'YANCEY 08 CRA',
                 'YANCEY 01 BUR', 'YANCEY 11 PRI', 'YANCEY 10 PEN', 'YANCEY 09 SOU', 'YANCEY 04 RAM']
    comp = [['5 GRE'], ['3 EGY'], ['7 BRU'], ['6 JAC'], ['2 CAN'],
            ['8 CRA'], ['1 BUR'], ['11 PRI'], ['10 PEN'], ['9 SOU'],['4 RAM']]
    data = update_all(name, data, votes16, votes18, precincts, comp)

    with open('NC_temp2.geojson', 'w') as f:
        json.dump(data, f)


def update_precinct(data, votes, precinct, comp, election_type):
    candidates = set(votes['candidate'].values) # list of candidates
    house_data = {}
    for c in candidates:
        d = votes[votes.candidate == c] # rows related to candidate
        tot = 0 # votes for candidate c
        for p_name in comp:
            if p_name in d[['jurisdiction']].to_numpy():
                tot += int(d[d.jurisdiction == p_name]['votes'].values[0])
        house_data.update({c: tot})

    for f in data['features']:
        prop = f['properties']
        if precinct == prop['PRENAME']:
            prop[election_type] = house_data
            break
    return data


def update_all(name, data, votes16, votes18, precincts, comp):
    house16 = 'HOUSE_ELECTION_16'
    house18 = 'HOUSE_ELECTION_18'
    v16 = votes16[votes16.parent_jurisdiction == name]
    v18 = votes18[votes18.parent_jurisdiction == name]
    for i in range(len(precincts)):
        data = update_precinct(data, v16, precincts[i], comp[i], house16)
        data = update_precinct(data, v18, precincts[i], comp[i], house18)
    return data


if __name__ == '__main__':
    #__run('RI_Precincts_MAPPED.geojson')

    """
    with open('NC_VDT_MAPPED.geojson') as f:
        data = json.load(f)
    with open('NC_temp.geojson', 'w') as f:
        json.dump(data, f)
    """

    file = 'NC_temp.geojson'
    with open(file) as f:
        data = json.load(f)

    voting16 = pd.read_csv('nc_2016.csv', dtype=str)
    votes16 = voting16[voting16.office == 'U.S. House'].drop(columns=['district'])
    voting18 = pd.read_csv('nc_2018.csv', dtype=str)
    votes18 = voting18[voting18.office == 'U.S. House'].drop(columns=['district'])

    update_NC(file, data, votes16, votes18)

    """
    pre = [
        Polygon([(1,2),(3,2),(3,0),(2.5,0.25),(2.75,0.5),(2.4,0.6),(1.7,0.8),(1,2)]),
        Polygon([(0,0), (1,1), (2,0), (0,0)]),
        Polygon([(0,0), (0,1.75), (1,2), (1,1), (0,0)]),
        Polygon([(0,1.75), (0,2), (1,2), (0,1.75)]),
        Polygon([(1,1), (1,2), (3,0), (2,0), (1,1)]),
    ]
    plot_polygons(pre)
    
    grid = __compute_search_spaces(pre)
    for p in pre:
        neighbors = get_precinct_neighbors(p, grid)
        for n in neighbors:
            print(n)
        print()
    """
