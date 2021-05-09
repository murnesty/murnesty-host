Murnesty.GraphicCard = function() {

    function _dataWrapper() {
        function getBrands() {
            var dfd = jQuery.Deferred();

            $.ajax({
                    headers: {
                        "Accept": "application/json"
                    },
                    type: 'GET',
                    url: "https://cors.bridged.cc/https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/pricelist.js",
                    crossDomain: true,
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    }
                })
                .done(function(data) {
                    dfd.resolve(data);
                });

            return dfd.promise();
        }

        return {
            getBrands: getBrands
        };
    }

    function init() {
        $.when(_dataWrapper().getBrands())
            .then(function(data) {
                // console.log(data);

                var patt = /(?:(product[0-9]+) +\: +{)|(?:(startingPrice[0-9]+) *\: *{)|(?:'en-my' +: +'(RM[0-9,]+)')/g
                var result = data.match(patt);
                console.log(result);

                const PRICE_STATE_ORI = 1,
                    PRICE_STATE_STR = 2;
                var products = [];
                var priceState = 0;
                for (var entry of result) {
                    var items = entry.split(":");
                    if (items[0].includes("'en-my'")) {
                        var p = items[1].replace("RM", "").replace(/,/g, "").replace(/'/g, "");
                        p = parseFloat(p);

                        switch (priceState) {
                            case PRICE_STATE_ORI:
                                products[products.length - 1].price = p;
                                break;
                            case PRICE_STATE_STR:
                                products[products.length - 1].startingPrice = p;
                                break;
                        }
                    } else if (items[0].includes("product")) {
                        var name = items[0].replace("product", "").trim();

                        if (!products.some(x => x.name === name)) {
                            products.push({ brand: "Nvidia", name: name, price: 0, startingPrice: 0 });
                        }
                        priceState = PRICE_STATE_ORI;
                    } else if (items[0].includes("startingPrice")) {
                        var name = items[0].replace("startingPrice", "").trim();

                        if (!products.some(x => x.name === name)) {
                            products.push({ brand: "Nvidia", name: name, price: 0, startingPrice: 0 });
                        }
                        priceState = PRICE_STATE_STR;
                    }
                }
                console.log(products);


                $("#allProductTable")
                    .empty()
                    .append(
                        $("<tr>")
                        .append($("<th>").text("Brand"))
                        .append($("<th>").text("Product"))
                        .append($("<th>").text("Current Price (RM)"))
                        .append($("<th>").text("Starting Price (RM)"))
                    )
                    .append(
                        _.chain(products)
                        // .orderBy(["discountPercentage", "discount", "price.value", "name"], ["desc", "desc", "asc", "asc"])
                        .map((p) => {
                            return $("<tr>")
                                .append($("<td>").text(p.brand || ""))
                                .append($("<td>").text(p.name || ""))
                                .append($("<td>").text(p.price || "NAN"))
                                .append($("<td>").text(p.startingPrice || "NAN"))
                        })
                        .value()
                    )
            });
    }

    return {
        init: init
    };
}