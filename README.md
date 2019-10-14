# patreactic_datacracy

## Application Run Instructions:
In patreactic_datacracy directory, enter command:

"npm run dev"

## Application Features:
* State, district, and precinct geographical boundaries
* Right sidebar with voting statistics
* Voting statistics change when hover over different districts
* Left sidebar with user controls
* Graphs and charts for displaying voting statistics
* Precincts display on zoom

## Git Workflow
This is the workflow we will use when making changes to code. In general, each of us will work on one separate feature at a time.
These features will be in `feature` branches (`feature/blah-blah`). Once the feature is complete, we will create pull requests which will be reviewed
by at least one other team member. The branch should be rebased onto `master` so the git history will be kept clean. If we use CI/CD, the code will be automatically built and tested at this point as well.
Once the tests pass and code has been reviewed, it will be merged into `master`. The idea here is that only clean, working, tested code is committed into the `master` branch for everyone to work off of.
If there is a bug that needs to be fixed in `master`, it will be fixed in a `bugfix` (`bugfix/remove-satan`) branch.

Here is the basic process:
1. Create feature/bugfix branch.
2. Write tests and code.
3. Commit as logical amounts of code are completed (and compile!).
4. Rebase onto master (`git checkout master && git pull && git checkout $branch && git rebase master`), resolving any merge conflicts (don't break someone elses code! Be careful here.).
5. Push to your branch.
6. Create a pull request with a brief explanation of what the code does.
7. Wait for review. You can obviously work on another feature or whatever in the mean time if you want!
8. Make any necessary changes and any suggested changes you agree with.
9. Repeat 6-7 as necessary.
10. Merge PR into master.
