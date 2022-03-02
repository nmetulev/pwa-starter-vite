module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

    //

    let clientPrincipal;

    const header = req.headers['x-ms-client-principal'];
    if (header) {
        const encoded = Buffer.from(header, 'base64');
        const decoded = encoded.toString('ascii');
        clientPrincipal = JSON.parse(decoded);
    }

    if (clientPrincipal) {
        context.bindings.userDocument = {
            id: clientPrincipal.userId,
            ...clientPrincipal
        }
        context.res.json({
            text: "You are signed in mr. " + clientPrincipal.userDetails
        });
    } else {
        context.res.json({
            text: "You are not signed in."
        })
    }
}