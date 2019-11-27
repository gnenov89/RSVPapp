// Run script once content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Target DOM elements
    const form = document.getElementById('registrar');
    const input = form.querySelector('input');
  
    const mainDiv = document.querySelector('.main');
    const ul = document.getElementById('invitedList');
  
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckBox = document.createElement('input');
  
    // Add filter checkbox to the page
    filterLabel.textContent = "Hide those who haven't responded";
    filterCheckBox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckBox);
    mainDiv.insertBefore(div, ul);
    // Filter out unconfirmed guests when checked
    filterCheckBox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const lis = ul.children;
      if(isChecked) {
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          let label = li.children[1];
          if (li.className === 'responded') {
            li.style.display = '';  
            // Hide 'confirm' label and checkbox on guest cards when filter is active
            label.style.display = 'none';
          } else {
            li.style.display = 'none';    
          }
        }
      } else {
        // Remove filter when unchecked
        for (let i = 0; i < lis.length; i += 1) {
          let li = lis[i];
          let label = li.children[1];
          li.style.display = '';
          label.style.display = '';
        }                                 
      }
    });
  
    // Check browser support for local storage
    if (typeof(Storage) !== "undefined")  {
  
      function createLI(text) {
        function createElement(elementName, property, value) {
          const element = document.createElement(elementName);  
          element[property] = value; 
          return element;
        }
  
        function appendToLI(elementName, property, value) {
          const element = createElement(elementName, property, value);     
          li.appendChild(element); 
          return element;
        }
  
        const li = document.createElement('li');
        appendToLI('span', 'textContent', text);     
        appendToLI('label', 'textContent', 'Confirm')
          .appendChild(createElement('input', 'type', 'checkbox'));
        appendToLI('button', 'textContent', 'edit');
        appendToLI('button', 'textContent', 'remove');
        return li;
      }
  
       // Retrieve guest list from local storage
       function getCurrentGuests() {
        const currentGuests = localStorage.getItem('guests');
        if (currentGuests) {
          return JSON.parse(currentGuests);
        } else {
          return [];
        }
      }
  
      // Retrieve all entries on page load
      const guestList = getCurrentGuests();
  
      // Add existing guests to ul
      let retrieveGuestList = '';
      getCurrentGuests().forEach( (guest) => {
        retrieveGuestList += guest;
      });
      ul.innerHTML = retrieveGuestList;
  
      // Add guest to local storage
      function addGuest(guestList) {
        localStorage.setItem('guests', JSON.stringify(guestList));
      }
  
      // Remove guest from local storage
      function removeGuest(name) {
        guestList.forEach( (guest) => {
          if (guest.includes(name)) {
            const removedGuest = guest;
            const index = guestList.indexOf(removedGuest);
            guestList.splice(index, 1);
            addGuest(guestList);
          }
        });
      }
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;
        // Register existing guests in a variable to check for duplicates
        const addedGuests = document.querySelectorAll('li span');
        let existingNames = [];
        addedGuests.forEach((name) => {
          existingNames += name.textContent;
          return existingNames;
        });
        // Empty input box after submitting guest
        input.value = '';
        // Check if input is blank
        if (text === '') {
          alert(`Sorry! We didn't get that name, could you please try again?`);
          // Check if input is a duplicate
        } else if (existingNames.includes(text)) {
            alert(`${text} is already in your guestlist!`);
          // Prevent new guests entries from showing when filter is active  
        } else if (filterCheckBox.checked) {
        const li = createLI(text);
        ul.appendChild(li);
        li.style.display = 'none';
          // Add new guest entry to guest list
        } else {
        const li = createLI(text);
        ul.appendChild(li);  
        // Add guests to local storage
        guestList.push(li.outerHTML);
        addGuest(guestList);
        }
      });
  
      ul.addEventListener('change', (e) => {
        const checkbox = event.target;
        const checked = checkbox.checked;
        const listItem = checkbox.parentNode.parentNode;
        const labelText = checkbox.parentNode.childNodes[0];
        if (checked) {
          listItem.className = 'responded';
          labelText.textContent = 'Confirmed';
        } else {
          listItem.className = '';
          labelText.textContent = 'Confirm';
        }
      });
  
      ul.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          const button = e.target;
          const li = button.parentNode;
          const ul = li.parentNode;
          const span = li.firstElementChild;
          let guestName = document.querySelector('li span');
          const action = button.textContent;
          const nameActions = {
            remove: () => {
              ul.removeChild(li);
              guestName = span.textContent;
              removeGuest(guestName);
            },
            edit: () => {
              const span = li.firstElementChild;
              const input = document.createElement('input');
              input.type = 'text';
              input.value = span.textContent;
              li.insertBefore(input, span);
              li.removeChild(span);
              button.textContent = 'save';  
            },
            save: () => {
              const input = li.firstElementChild;
              const span = document.createElement('span');
              span.textContent = input.value;
              li.insertBefore(span, input);
              li.removeChild(input);
              button.textContent = 'edit';        
            }
          };
  
          // select and run action in button's name
          nameActions[action]();
        }
      }); 
    } 
  });