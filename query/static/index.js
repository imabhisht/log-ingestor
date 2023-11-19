const baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
let spinner_element;
let query_config = {
    "level": ""
}

function addRowsToTable(data) {
    const tableBody = document.getElementById('tableBody');

    data.forEach(item => {
        const row = document.createElement('tr');

        const originalUrlCell = document.createElement('td');
        originalUrlCell.textContent = item.original_url;
        originalUrlCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-left', 'text-gray-600', 'truncate');

        const shortUrlCell = document.createElement('td');
        shortUrlCell.classList.add('border', 'border-gray-300', 'px-4', 'py-2', 'text-left', 'text-blue-600');

        const shortUrlLink = document.createElement('a');
        shortUrlLink.href = item.short_code;
        shortUrlLink.textContent = `${item.short_code}.url`;

        shortUrlCell.appendChild(shortUrlLink);

        // Add a new column for the Analysis button
        const analysisCell = document.createElement('td');
        const analysisButton = document.createElement('button');
        analysisButton.textContent = 'Analysis';
        analysisButton.classList.add('bg-blue-600', 'text-white', 'font-bold', 'px-2', 'py-1', 'rounded', 'hover:bg-blue-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-600');

        // Add an event listener to the Analysis button
        analysisButton.addEventListener('click', () => {
            // Redirect to the "/<short_code>/stats" route
            window.location.href = `/stats?code=${item.short_code}`;
        });

        analysisCell.appendChild(analysisButton);

        row.appendChild(originalUrlCell);
        row.appendChild(shortUrlCell);
        row.appendChild(analysisCell);

        tableBody.appendChild(row);
    });
}



function addRows_To_Table(data) {
    const tableBody = document.getElementById('t-data');
    console.log("At ADD ROWS",data)
    tableBody.innerHTML = `
    <tr id="loading_spinner">
    </tr>
    `;
    data.forEach(async item => {

        const timestampStr = item._source.timestamp;

        const timestampDate = new Date(timestampStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedText = timestampDate.toLocaleDateString('en-US', options);


        // scrapped_info = await getURLInfo(item.original_url);
        spinner_element.style.display = "none";

        tableBody.innerHTML += `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="w-4 p-4">
                <div class="flex items-center">
                    <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                </div>
            </td>
            <td class="px-6 py-4">
                <a href="">${(item._source.resourceId)}</a>
            </td>
            <td class="px-6 py-4">
                <a href="">${(item._source.traceId)}</a>
            </td> 
            <td class="px-6 py-4">
                <a href="">${(item._source.spanId)}</a>
            </td>
            <td class="px-6 py-4">
            ${
                item._source.level === "error" ? `<button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Error</button>`
                : item._source.level === "info"
                ? `<button type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-xs px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Info</button>`
                : `<button type="button" class="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-xs px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900">Warning</button>`
            }
            </td>
            <td class="px-6 py-4">
                <a href="">${(formattedText)}</a>
            </td>
        </tr>
        `

    })

}

async function fetchListOfAllData() {
    try {

        
        const response = await fetch(`${baseURL}/search`);
        if (response.ok) {
            const data = await response.json();
            // Process the data here
            console.log(data);
            return data;
        } else {
            console.error('Failed to fetch data');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return []
    }
}


async function fetchSearchData() {
    try {

        spinner_element = document.getElementById('loading_spinner');
        spinner_element.style.display = "block";
        const url = new URL(`${baseURL}/search`);

        // Add query parameters from query_config
        Object.keys(query_config).forEach(key => {
        if (query_config[key] !== "") {
            url.searchParams.append(key, query_config[key]);
        }})

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            // Process the data here
            console.log("Fetched: ",data);
            addRows_To_Table(data);
            // return data;
        } else {
            console.error('Failed to fetch data');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        // return []
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    
    spinner_element = document.getElementById('loading_spinner');
    // spinner_element.style.display = "block";
    apiData = await fetchListOfAllData();
    console.log("This is Data",apiData)
    addRows_To_Table(apiData);

    const dropdownActionButton = document.getElementById('dropdownActionButton');
    const dropdownAction = document.getElementById('dropdownAction');

    // Add click event listener to the dropdown button
    dropdownActionButton.addEventListener('click', function () {
      dropdownAction.classList.toggle('hidden');
    });

    // Add click event listeners to each dropdown item
    const dropdownItems = dropdownAction.querySelectorAll('a');
    dropdownItems.forEach(function (item) {
      item.addEventListener('click', function () {
        // Get the text content of the clicked item
        const selectedItemText = item.textContent.trim();
        
        // Call your JavaScript function with the selected item text
        handleDropdownItemClick(selectedItemText);
        console.log(query_config)
        // Close the dropdown
        dropdownAction.classList.add('hidden');
      });
    });

    // Your JavaScript function to handle dropdown item click
    function handleDropdownItemClick(selectedItemText) {
      console.log('Item clicked:', selectedItemText);
      query_config["level"] = selectedItemText.toLowerCase();
      fetchSearchData()
      // Add your logic here to perform actions based on the clicked item
    }


    document.getElementById("shortenButton").addEventListener("click", function () {
        var url = document.getElementById("url").value;
        // shortenURL(url);
        searchAnything(url)
    });

    async function shortenURL(url) {
        alert("Entered URL: " + url);

        const apiUrl = `${baseURL}/shorten`;
        const requestData = {
            url: url
        };

        // Create a request configuration
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        };


        // Make the POST request
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        reponse_data = await response.json();
        console.log(reponse_data);
        alert("Contiune?")

    }
});


async function searchAnything(value){
    try {
        spinner_element = document.getElementById('loading_spinner');
        spinner_element.style.display = "block";
        const url = new URL(`${baseURL}/search`);

        // Add query parameters from query_config

        url.searchParams.append("q", value);
        console.log(url)

        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            // Process the data here
            console.log("Fetched: ",data);
            addRows_To_Table(data);
            // return data;
        } else {
            console.error('Failed to fetch data');
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        // return []
    }
}


async function getURLInfo(url_to_scrap) {
    try {
      const response = await fetch(`${baseURL}/scrap-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({
            url: url_to_scrap,
        }), // Convert the data to JSON format
      });
  
      if (response.ok) {
        const responseData = await response.json(); // Parse the response as JSON
        console.log('Response:', responseData);
        return responseData;
      } else {
        throw new Error('Request failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }