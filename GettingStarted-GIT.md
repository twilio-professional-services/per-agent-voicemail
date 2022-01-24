# For your first clone - Get the repo and start coding!!!!

-Ensure you have GIT installed for support from the CLI https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-mac-md

-Navigate in your CLI to the directory you would like to develop in

-Next, we will clone the main branch to your local directory

```bash
git clone https://code.hq.twilio.com/jmchargue/plugin-per-agent-voicemail.git
```
-Change directories to your newly created folder which contains the cloned repo
```bash 
cd plugin-per-agent-voicemail
```
-Lets create a feature branch. This is a version of the main branch which you will name after the feature you are developing. In my example I am working on "Get and store voicemail into sync" so that will be the name of my branch. NO SPACES!!!!

```bash
git checkout -b get-and-store-voicemail-into-sync
```
Code away! Move on to the next section for commit when you have completed testing and believe your feature is complete, or you just want to backup your code to the remote branch!

# Add changes and commit to your local feature branch

First, we need to stage our changes we have made, before commiting them to our local branch. We can do this to all of our changed files at once.

```bash
git add --all
```

Next we will commit the changes to our local branch, and add a commit message which is a short description of the new changes.

```bash
git commit -m 'Example: Created basic Function service for backend'
```

Great, we have committed our changes locally, and we are ready to merge any changes from the main branch with our code. Move on to the "Committing your branch to the remote server". 

# Committing your branch to the remote server

Ok so you wrote some code, it does cool stuff and your ready to merge it to the rest of the project. Way to go! The first thing you want to do, is make sure it is still based off of the most up-to-date main branch. Some one may have committed an approve PR since you last made this branch, and you may need to test that it doesnt break your stuff!

The way to do this, is to pull down the main branch again from the remote server, and merge it to your feature branch and then test to make sure your feature still works. Depending on how much has changed, you may want to do this with an experienced buddy since you could have to "resolve conflicts".

1)Switch to the main branch
```bash
git checkout main
```
2)Download the newest main branch
```bash
git pull origin HEAD
```
3)Merge the main branch with your feature branch(you should currently be on the main branch since we had to update it)
If you forgot the name of your feature branch, you can execute this CLI command to see local branches ``` git branch```

  First we checkout our branch again
```bash
git checkout get-and-store-voicemail-into-sync
```
  Next, we are going to merge the main changes into our branch!
  
```bash
git merge main
```
  If there are conflicts....
```bash
Stuff will go here to discuss managing conflicts
```
4)If there were no conflicts, or you have completed the conflict resolution, we need to test our code one more time to ensure the changes in the main branch didnt break anything.

  Before testing your application again, go to the app directory in your CLI and rebuild in case new dependencies have been added
```bash
npm install
```
5)Ok, we merged changes, rebuilt the app, and tested that it still works. Now we are ready to push to the remote repo. Since this is our first time pushing this feature branch to the repo, we need to tell the remote repo what we want the branch name to be. 

```branch
git push -u origin get-and-store-voicemail-into-sync
```

Ok!! your local branch now has a remote branch! Later we can make a pull request to update the Main branch with your feature code!

# Creating a pull request to main from a remote branch

To be completed, but here is the outline:
- Submit the PR to merge feature to main
- At least one peer needs to perform a code review
- Upon complete of any items from the review, the PR can be approved and merged
