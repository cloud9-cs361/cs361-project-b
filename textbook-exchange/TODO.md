# NOTES
* Sessions will be deleted every time a file is saved which restarts the app; so if you are working on something and resaving often, your session will be deleted


# Bugs
* Currently '<' and '>' are surrounding first entry in book list in profile view, likely a result of the query to obtain a user's books?

# High Priority
* Implement searching for books
* Implement searching for books within a proximity
* Fix displaying books in user profile and include price

# Medimum Priority (code structure, helpful items, design, etc.)
* Improve erorr checking in addbook.js
* Adding a book needs to allow doubles for price

# Low Priority (non-critical features that would be good to implement)

* Create hash for passwords and store that in database and use that to authenticate with
* Don't delete all user information when creating an account, just delete password
* Ability to look up existing book and prefill form