import json
from shapely.geometry import shape, Polygon, LineString, GeometryCollection, MultiPolygon
from shapely.ops import split, shared_paths
import math
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
        #print('b_min: ', b_min, '\tb_max: ', b_max)
        #print('bound_min: ', bounds_min, '\tbound_max: ', bounds_max)

        for i in range(len(bounds_min)):
            if b_min[i] < bounds_min[i]:
                bounds_min[i] = b_min[i]
            if b_max[i] > bounds_max[i]:
                bounds_max[i] = b_max[i]
        #print('new bound_min: ', bounds_min, '\tnew bound_max: ', bounds_max)

    bounds = bounds_min
    bounds.extend(bounds_max) # bounds -- 4 coordinates of a rectangle that encompasses the entire state
    print('state grid bounds: ', bounds)

    x_coor = [bounds[i] for i in range(0,4,2)]
    y_coor = [bounds[j] for j in range(1,4,2)]
    coor = [] # [(minx, miny), (minx, maxy), (maxx, miny), (maxx, maxy)]

    # get coordinate bounds of grid
    for x in x_coor:
        for y in y_coor:
            coor.append([x,y])
    #print('grid rectangular coordinates: ', coor)

    outline = Polygon(coor).convex_hull
    print('grid rectangular outline: ', outline)

    # get length (x distance) and width (y distance) and divide by 5 (some number to get appropriate number of boxes)?
    print(list(outline.exterior.coords))
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
@return: A dictionary, where the keys are precincts (as a tuple) 
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
                search_space[p_coords] = p2
            else:
                vals = p2.union(search_space[p_coords]).difference({p_coords})
                search_space[p_coords] = vals

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
    # ask group: does it matter how much overlap??? must be 100ft or just overlap is fine?
    if precinct1.overlaps(precinct2):  # precincts intersect, but neither contains the other -- maybe not if intersection occurs at a corner???
        return True
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

    # check for shared paths -- need to account for complete separation (no intersection) but within 100 ft?
    # note: coordinates order is longitude latitude
    geo = Geod(ellps='GRS80')
    epsilon = 100*0.3048 # 100 ft = 30.48 meters
    for line1 in l1:
        for line2 in l2:
            sp = shared_paths(line1, line2)
            if len(sp) > 0:
                dst = geo.geometry_length(sp) # in meters -- should work
                if dst >= epsilon: # or sp[0].length???
                    return True
    return False


"""
@param precincts: The list of all precincts.
@param precinct: The precinct whose neighbors you want to find.
@return: The list of neighboring precincts.
"""
def get_precinct_neighbors(precincts, precinct, grid):
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
Coverts a list that contains Polygons/Multipolgyons into a list that only contains Polygons.
Note: there are currently some commented lines -- take them out in final product. Also, method needs tweaking b/c if we
separate a multipolygon precinct into all its resulting polygons, there will be too many shapes and processing slows down.
@param collection: List of geometric objects that include Polygons and MultiPolygons
@return: A list of Polygons
"""
def __all_polygons(collection):
    new_collection = []
    for poly in collection:
        if isinstance(poly, MultiPolygon):
            pass
            #for p in poly:
            #    new_collection.append(p)
        else:
            new_collection.append(poly)
    return new_collection


"""
Plots the polygons and labels them in order listed
@param polygons: List of polygons to be plotted
"""
def plot_polygons(polygons):
    count = 1
    for p in polygons:
        x,y = p.exterior.xy
        plt.plot(x,y, 'r')
        plt.text(sum(x)/len(x), sum(y)/len(y), s=str(count))
        count += 1


if __name__ == '__main__':

    with open('RI_Precincts_MAPPED.geojson') as file:
        data = json.load(file)

    features = data['features'] # list of dictionaries, with each dictionary containing info on geometry
    collection = GeometryCollection([shape(feature['geometry']).buffer(0) for feature in features]) # geometry of each precinct
    file.close()

    collection = __all_polygons(collection)
    # plot rhode island
    plot_polygons(collection)

    print(len(collection)) # 2845 polygons in RI, but only 419 precincts

    grid = __compute_search_spaces(collection)
    for poly in collection:
        neighbors = get_precinct_neighbors(collection, poly, grid)
        print(neighbors)
        break

    """

    pre = [Polygon([(0,0), (1,1), (2,0), (0,0)]),
           Polygon([(0,0), (0,1.75), (1,2), (1,1), (0,0)]),
           Polygon([(0,1.75), (0,2), (1,2), (0,1.75)]),
           Polygon([(1,1), (1,2), (3,0), (2,0), (1,1)]),
           Polygon([(1,2),(3,2),(3,0),(2.5,0.25),(1,2)])
           ]

    plot_polygons(pre)
    plt.show()

    #grid = __compute_search_spaces(pre)
    #for p in pre:
    #    neighbors = get_precinct_neighbors(pre, p, grid)
    #    break

    # note: multipolygon in collections -- no point.exterior.coords --> how to fix?

    geo = Geod(ellps='GRS80')
    geom = LineString([(-78.119956, 43.374880), (-78.119666, 43.374868)])
    dst = geo.geometry_length(geom)
    print(dst) # roughly 23.539 meters
    
    p = Polygon([(0,0), (1,0), (1,1), (0,0)], [[(0,0.2), (0.8,0.2), (0.8,0.8), (0,0.2)]]) # contains a hole -- no problem using exterior
    print(p.exterior)

    mp = MultiPolygon([p,
                       Polygon([(0,0),(1,1),(0,1),(0,0)])])
    """
