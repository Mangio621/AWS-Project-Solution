// This function simply sets up the listeners for all server message events (when the server sends a message to the client) 
// This function is to be called only once.
    /*

    socket.on('event', (data) => {
        // DO STUFF WITH SERVER LOGIC
    });

    // To send the server data with a js object
    socket.emit('event', {DATAOBJECT});

    */
    
const portfolioPage = (socket) => {
    socket.on('receive-all-customers', (results) => {
        results.map(data => {
            $('#customers-list').append(`
                <tr> 
                    <td>`+data.custFname +' '+data.custLname+`</td>
                    <td>`+data.custEmail+`</td>
                    <td>`+data.custPhone+`</td>
                    <td><a href="/portfolio-view?cust-id=`+data.custID+`">Link</a></td>
                </tr>
            `);
        });
    });
    socket.emit('get-all-customers', 'customers.csv');
}

const custCreatePage = (socket) => {
    // When save button is clicked
    $('#cust-save').click(() => {
        const customerRecord = {
            custID: null,
            custFname: $('#form-firstName').val(),
            custLname: $('#form-lastName').val(),
            custPhone: $('#form-phone').val(),
            custEmail: $('#form-email').val(),
            custAge: $('#form-age').val(),
            custSalary: $('#form-salary').val(),
            custIcon: $('#form-pfp').val()
        }
        socket.emit('add-new-customer', customerRecord);
    });
    socket.on('receive-new-customer', () => {
        window.location.href = '/';
    });
}

const portfolioViewPage = (socket) => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerID = urlParams.get('cust-id');
    socket.emit('get-customer-details', customerID);
    socket.emit('get-customer-assets', customerID);
    socket.on('receive-customer-details', (record) => {
        const customer = record[0];
        $('#user-info-table').append(`
            <tr>
                <th> Name </th>
                <td>`+customer.custFname+' '+customer.custLname+`</td>
            </tr>
            <tr>
                <th> Phone </th>
                <td>`+customer.custPhone+`</td>
            </tr>
            <tr>
                <th> Email </th>
                <td>`+customer.custEmail+`</td>
            </tr>
            <tr>
                <th> Age </th>
                <td>`+customer.custAge+`</td>
            </tr>
            <tr>
                <th> Salary </th>
                <td>$`+customer.custSalary+`</td>
            </tr>
        `);
        $('#user-img').attr("src", customer.custIcon);
    });
    socket.on('receive-customer-assets', (records) => {
        console.log(records);
        records.map(record => {
            $("#tab-portfolio-data").append(`
                <tr>
                    <td>`+record.assetName+`</td>
                    <td>`+record.assetCat+`</td>
                    <td>`+record.assetPdate+`</td>
                    <td>`+record.assetPprice+`</td>
                    <td>`+record.assetSdate+`</td>
                    <td>`+record.assetSprice+`</td>
                </tr>
            `);
        });
    });
}

// On document is ready/loaded. This is the entry point of the client script
$(() => {
    const socket = io(); // The socket variable to be passed into different functions/components to talk to the server
    if(page == 'portfolio') {
        portfolioPage(socket);
    } else if (page == 'cust-create') {
        custCreatePage(socket);
    } else if (page == 'portfolio-view') {
        portfolioViewPage(socket);
    }
});