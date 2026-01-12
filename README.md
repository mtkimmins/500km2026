# IN PROGRESS
* Loading new API data format
* Truncating km display values

---
# Overview
Data flows from: Google Sheets -> Google App Scripts (API) -> JSONP -> Github Pages

### Data Setup
1) Google Sheets format data that can be packaged
2) Google App Script attached to target sheet packs data into JSON

### Request Data
1) Github pages sends an HTTP request
2) Example request = https://script.google.com/macros/s/AKfycb.../exec?callback=handleData&foo=bar
    * the important part is everything after "exec" (meaning to execute)
    * everything after "?" is a list of variable declarations
    * each declaration is in the format "[name]=[data]"
    * you can string many declarations together by using "&" in between each
    * these variable declarations can be used by the receiving application to inject into its code (ready to receive)
3) Make sure your parameters match functions or variables used in Javascripts you write (where applicable)
4) This request should be triggered when the page loads so there exists a place to put the received data

### Sending Back Data
1) Google App Script returns a transferable object by "ContentService.TextOutput([data])"
2) App Scripts uses the callback function provided, so I can package the JSON and tag it with the callback that will be executed upon arrival
3) 

### Receiving Data
Its like a person (Github) orders a pizza from Dominos (App Scripts). When the pizza is ready, Dominos just shouts "Pizza for [person]?" The person takes the pizza and already has a plan to eat it in a particular way.
1) The callback should be a global scope so you can execute it anywhere
2) Turn the JSON string data into an object again
3) Run your local code from the new JSON object data

---
# Debugging Tips
* To check if the App Script will return what you want, put the JSONP request directly in a browser URL itself. If it returns a string that you want, you're golden.
* App Scripts must be re-deployed after each edit. You will have to take that custom URL and replace it in github pages each time. It is best to debug independent of Github commits (because the git commitment/update process is so slow).