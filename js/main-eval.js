
// Path: main.js
console.log('=== main.js');

console.log('Extension CEX: loaded 1');

(function() {

    /** 
     * Add button to delete all messages
     * 
     */
    let newHTML = document.querySelectorAll("h1.room-chat-header-name");
    newHTML.forEach(function(item) {
        // If button already exists, do nothing
        if (document.getElementById("btnDeleteAll")) {
            return;
        }

        // Add button to delete all messages
        let newButton = document.createElement("button");
        newButton.textContent = "Delete ALL";
        newButton.id = "btnDeleteAll";
        newButton.className = "btn btn-danger btn-sm m-5";
        item.appendChild(newButton);
    });


    /**
     * Click #btnDeleteAll
     */
    document.getElementById("btnDeleteAll").addEventListener("click", function() {
        
        // Warning
        if (confirm("Are you sure you want to delete all messages?")) {
            // Code to execute if the user clicks "OK" (Yes)
            console.log("Messages deleted.");
        } else {
            // Code to execute if the user clicks "Cancel" (No)
            return;
        }

        /** Start: delete message */
        let url_laka    = window.location.href;
        let room_id     = url_laka.split("rid-")[1];
        let user_info   = JSON.parse(localStorage.getItem("user"));
        let user_token  = user_info.token;
        let user_id     = user_info.user_id;
        
        if (url_laka) {
            // get .chat-element-message last and get data-id
            let message_id_max = document.querySelector(".chat-element-message:last-child > .message-item").getAttribute("data-id");
            let timestamp_now = Math.floor(Date.now() / 1000);
        
            // foeach from 1 to message_id_max
            for (let i = 1; i <= message_id_max; i++) {
        
                let data = {
                  "current_page": 1,
                  "file_id": null,
                  "is_edited": 0,
                  "label": {
                      "room_label": [],
                      "user_label": []
                  },
                  "message_id": i,
                  "message": "...",
                  "status": "0",
                  "room_id": room_id,
                  
                  "timestamp": timestamp_now,
                  "updated": timestamp_now,
                  "user_info": {
                      "id": user_id
                  },
                  "reaction": [],
                  "reply": {
                      "count": 0,
                      "info": []
                  }
              };

              let https = 'https://';
              let domain1 = 'laka.la';
              let domain2 = 'mpart-vn.com';
              let api = '/api/v2/message/delete';
        
              fetch(https + domain1 + domain2 + api, {
                "headers": {
                  "accept": "application/json",
                  "accept-language": "en-US,en;q=0.9,ja;q=0.8,vi;q=0.7",
                  "authorization": "Bearer " + user_token,
                  "content-type": "application/json;charset=UTF-8",
                  "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "Referer": url_laka,
                  "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": JSON.stringify(data),
                "method": "POST"
                });
        
            }
        }

        /** End: delete message */
    });

})();
