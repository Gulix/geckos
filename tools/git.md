Some useful git commands and git overview of the project

* `gh-pages` branch : used to deploy on github.io, have only the content `src` directory
* `master` branch : current branch of release. Can be ahead of release with updates on templates. Is merged into gh-pages.
* `vX.Y.Z` branch : current branch of development. Will be merged into master before release.
* `issueXXX` branch : particular development branch for a particular issue

## Putting the master branch on gh-pages :
When on the gh-pages branch

    git merge --no-ff -s recursive -X subtree=src master
