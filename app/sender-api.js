/**
 * Created by juan.torres on 23/11/2016.
 */
// Params: message, gets the contents of the original message

exports.headerMessage = function (userId, content){
    return {
        recipient:{
            id:userId
        },
        message:content
    };
}

/*
 Returns plain text message element
 https://developers.facebook.com/docs/messenger-platform/send-api-reference/text-message
 */
exports.plainText = function (message){
    return {
        text: message
    };
}

/*
 Returns image message element
 https://developers.facebook.com/docs/messenger-platform/send-api-reference/image-attachment
 */
exports.image = function (content){
    return {
        attachment:{
            type:"image",
            payload:{
                url:content
            }
        }
    };
}

/*
 Returns Generic template
 https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
 */
exports.genericTemplate = function (content){
    var elements = [];
    for (var i=0; i<content.elements; i++){
        var item = content.elements[i];
        elements.push(exports.element(item));
    }
    return {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: elements
            }
        }
    };
}

/*
 Returns Quick Reply Template
 https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies
 */
exports.quickReply = function (content){
    return {
        text:content.label,
        quick_replies:content.replies
    }
}

/*
 Returns receipt template
 https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template
 */
exports.receipt = function (content){
    var elements = [];
    for (var i=0; i<content.elements; i++){
        var item = content.elements[i];
        elements.push(exports.element(item));
    }
    return {
        attachment:{
            type:"template",
            payload:{
                template_type:"receipt",
                recipient_name:content.name,
                order_number:content.ref,
                currency:"COP",
                payment_method:content.paymentMethod,
                timestamp:content.time,
                elements:elements,
                address:content.address,
                summary:content.summary
            }
        }
    };
}

exports.element = function (content){
    return {
        title: content.title,
        item_url: content.url,
        image_url: content.imageUrl,
        subtitle: content.subtitle,
        buttons: content.buttons,
        price: content.price,
        currency:"COP"
    };
}

