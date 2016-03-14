# Bookr Installation Guide

Our website is hosted on [Cloud9](https://c9.io) using an a custom Ubuntu workspace; at the time of this writing the version of Ubuntu that came with the workspace was `Ubuntu 14.04.3 LTS Trusty`.  The compilation steps below are under the assumption that you are creating a **new** Custom Ubuntu workspace on Cloud9.

## Cloud9 Workspace Creation

1. Create an account on [Cloud9](https://c9.io) (note your username as it will be needed for accessing the website)
2. Select `Create a new workspace`
	* Give your workspace a name (note this name as it will be needed for accessing the website)
	* Select private our public (if private only **YOU** can access the running site while logged in)
	* Select `Custom` from the list of templates
	* Click `Create workspace`

### For any commands listed below enter them from the default workspace directory unless directed to do otherwise

## Environment Setup

To set up the environment you will want to use `n` which is a new version of `Node.js`.  Run the following commands in the order given.  

Select yes at any prompts and ignore any warnings/errors unless specific instructions say otherwise.  If a command is prepended with a hashtag `#`, the command is not required; read the respective note regarding that line.

**NOTE `mongodb`:** If following these steps using a Cloud9 instance, you should not have to install `mongodb`.  At the time of this writing the version of `mongodb` that comes with a new workspace is `mongodb-org v2.6.11`.    

	sudo apt-get update
	sudo apt-get install npm -y
	sudo npm install npm --global
	sudo npm install n --global
	sudo npm install mocha --global
	# sudo apt-get install mongodb-org # NOTE: See note regarding mongodb above
	sudo mongod --fork --logpath /var/log/mongod
	git clone https://github.com/cloud9-cs361/cs361-project-b.git
	cd ~/workspace/cs361-project-b/textbook-exchange/mongodump
	mongorestore -p dump/bookr
	mongorestore -p dump/geonames
	cd ~/workspace/cs361-project-b/textbook-exchange
	npm install
	cd ~/workspace/cs361-project-b/textbook-exchange/node_modules/monk
	npm install
	cd ~/workspace/cs361-project-b/textbook-exchange/node_modules/monk/node_modules/mongoskin
	npm install
	
### Alternative install via script

If using Cloud9 you should be able to install the above via the linked [script](http://jensbodal.com/cs361/bookr-install.sh).  If that doesn't work try manually entering the commands listed above from the default workspace command prompt in Cloud9
	
	wget http://jensbodal.com/cs361/bookr-install.sh -O bookr-install.sh
	chmod +x bookr-install.sh
	./bookr-install.sh

## Running the site

Open a new terminal and run the site from the main app folder 

	cd ~/workspace/cs361-project-b/textbook-exchange
	node bin/www
	
**Note:** If using Cloud9, and your instance is private, only an authorized user on your workspace can view the site.

Access your site via the following URL format:

	http://[workspace-name].[username].c9users.io/
	e.g. http://bookr-test4.bodalj.c9users.io/

## Unit Tests

For unit testing, we decided to use `Mocha` since it works well with `Node.js` and is for doing unit testing on javascript files.  After installing Mocha in our project, we created a test folder and a file called test.js inside the test folder (`cs361-project-b/textbook-exchange/test`).  We wrote all of our unit tests in the test.js file.

**Describing the tests**

Each group of tests starts with a description of what is being tested, for example, `validate creation account`.  Then, within the group, there are also subgroups like `password`.  Finally, each test is given a name that is descriptive of what is being tested like `password contains at least one lowercase letter`.  These descriptions are useful in reading the code as well as for when the tests are run since they are listed as passing or failing at this time.  If the descriptions aren’t descriptive enough, it is hard to figure out which tests are passing or failing and what they were trying to test.

**Writing the tests**

The tests use the actual functions with some hard-coded test values.  These values are chosen to make it obvious if they are supposed to be good values or not like `validpA$$w0rd` for a good password or `badpa$$w0rd` for a bad password.  It is usually best to test just one bad parameter in each test so that if it fails you know what the culprit is.  For input testing, we tested one requirement at a time for each parameter.  For example, there is a test to make sure that passwords require uppercase letters and one to test that they require lowercase letters.  After you choose the parameters to provide your function, you make assertions in your tests based on how you expect your function to respond (like any errors it might return).  If your assertions, match the results of running your function with the given parameters, then the test passes.

**Running the Unit Tests**

To run the unit tests, you simply type `mocha` into the command line from the main app directory (`cs361-project-b/textbook-exchange`).  Mocha will run all of your unit tests and let you know which ones passed and which ones failed.  For the tests that failed, it will give the expected results and then also the actual results.


# Our Site
A live working version of our site is hosted at [http://cs361-project-b.bodalj.c9users.io/](http://cs361-project-b.bodalj.c9users.io/)
