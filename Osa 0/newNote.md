```mermaid
sequenceDiagram
	participant browser
	participant server
	
	Note right of browser: User types new note and presses save
	
	browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
	activate server
	
	Note left of server: Server adds the note to the json file
	
	server-->>browser: Response with a header "Location: /notes"
	deactivate server
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: js file
    deactivate server
	
	Note right of browser: Browser starts to run js code, which uses AJAX to fetch the json data
	
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: json data
    deactivate server
	
	Note right of browser: Browser adds all the notes to the DOM
```