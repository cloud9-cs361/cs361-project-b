# NOTES
* Sessions will be deleted every time a file is saved which restarts the app; so if you are working on something and resaving often, your session will be deleted


# Bugs
* ~~Currently '<' and '>' are surrounding first entry in book list in profile view, likely a result of the query to obtain a user's books?~~


# High Priority
* ~~Implement searching for books~~ This is working for search box in top right
* Implement searching for books within a proximity
* Buying a book is from search results
* ~~Fix displaying books in user profile and include price~~
* ~~Implement advanced search - can just reuse functions from search~~

# Medimum Priority (code structure, helpful items, design, etc.)
* Improve erorr checking in addbook.js
* ~~Adding a book needs to allow doubles for price~~
* When adding a book if the ISBN exists the existing book entry will populate.  Adding a book should consist of searching the ISBN, then filling in information if it does not exist

# Low Priority (non-critical features that would be good to implement)

* Create hash for passwords and store that in database and use that to authenticate with
* Don't delete all user information that was filled when creating an account if they receive an error, just delete password
* Ability to look up existing book and prefill form
