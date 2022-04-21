//wrapper
let dialogWrapper = document.createElement("dialog"),
dialogBody = document.createElement("section"),
dialogContent = document.createElement("aside"),
dialogHeader = document.createElement("header"),
dialogTitle = document.createElement("dialog-title"),
dialogClose = document.createElement("button");

Module.register("MMM-CalendarExt2-viewDay",{

	defaults: {
	},

	// Override dom generator.
    getDom: function() {
        //close button
        dialogClose.innerHTML = 'X';
        dialogClose.className = 'closeButton';
        dialogClose.addEventListener('click', event => {
            dialogWrapper.removeAttribute("open");
        })

        //assemble
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(dialogClose);
        dialogBody.appendChild(dialogHeader);
        dialogBody.appendChild(dialogContent);
        dialogWrapper.appendChild(dialogBody);

        return dialogWrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        function showDialog(event) {
            dialogContent.innerHTML = "";
            dialogWrapper.setAttribute("open","");

            let parent = event.target.parentNode,
                startTime = parent.dataset.start,
                endTime = parent.dataset.end;

            const events = document.querySelectorAll('.MMM-CalendarExt2 .event');

            events.forEach(event => {
                if (event.dataset.startDate >= startTime && event.dataset.endDate <= endTime) {
                    console.log(event);

                    let title = event.querySelector(".eventTitle").textContent,
                        date = event.querySelector(".startDate").textContent,
                        startTime = event.querySelector(".startTime").textContent,
                        endTime = event.querySelector(".endTime").textContent,
                        desc = event.querySelector(".eventDescription").textContent,
                        loc = event.querySelector(".eventLocation").textContent,
                        newEvent = document.createElement("article");

                    dialogTitle.innerHTML = `${date}`

                    newEvent.innerHTML =
                        `${title} </br>
                     ${startTime} - ${endTime} </br>
                     <p>${desc}</p>
                     <p>${loc}</p>`;

                    dialogContent.append(newEvent);
                }
            })
        }

        if (notification === "DOM_OBJECTS_CREATED") {
            // Select the node that will be observed for mutations
            const targetNode = document.querySelector('.fullscreen.below');

            // Options for the observer (which mutations to observe)
            const config = { attributes: false, childList: true, subtree: true };

            // Callback function to execute when mutations are observed
            const callback = function(mutationsList, observer) {
                mutationsList.forEach(item => {
                    if(item.addedNodes.length > 0 &&
                        item.addedNodes[0].className.includes("weekSlot") === true) {
                        item.addedNodes[0].childNodes[1].childNodes.forEach(node => {
                            node.addEventListener('click', event => {
                                console.log(event);
                                showDialog(event);
                            })
                        })
                    }
                })
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }

        /*if (notification === "CALEXT2_CALENDAR_MODIFIED") {
            const days = document.querySelectorAll('.MMM-CalendarExt2 .view.month .weekSlot .slot');
            days.forEach( day => {
                day.addEventListener('click', event => {
                    console.log(event);
                    this.showDialog(event);
                })
            });
        }*/
    },

    getStyles: function() {
        return [
             this.file('MMM-CalendarExt2-viewDay.css'),
        ]
    }

});