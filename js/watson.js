Murnesty.Watson = function() {

    function _dataWrapper() {
        function getBrands() {
            var dfd = jQuery.Deferred();

            $.ajax({
                    headers: {
                        "Accept": "application/json"
                    },
                    type: 'GET',
                    url: "https://cors.bridged.cc/https://api.watsons.com.my/api/v2/wtcmy/brands?fields=FULL&lang=en&curr=MYR",
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

        function getProduct(code) {
            var dfd = jQuery.Deferred();
            var productUrl = `https://cors.bridged.cc/https://api.watsons.com.my/api/v2/wtcmy/products/search?fields=FULL&query=%3AproductBrandCode%3AproductBrandCode%3A${code}&pageSize=32&sort=bestSeller&lang=en&curr=MYR`;

            $.ajax({
                    headers: {
                        "Accept": "application/json"
                    },
                    type: 'GET',
                    url: productUrl,
                    crossDomain: true,
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    }
                })
                .done(function(data) {
                    var newProducts =
                        _.chain(data.products)
                        .map((p) => {
                            var n = {};
                            n.name = p.name;
                            n.price = p.price;
                            n.elabMarkDownPrice = p.elabMarkDownPrice;
                            n.masterBrand = p.masterBrand;
                            n.discountPercentage =
                                (p.elabMarkDownPrice || {
                                    value: 0
                                }).value === 0 ?
                                0 :
                                parseFloat((
                                    (
                                        (p.price || {
                                            value: 0
                                        }).value -
                                        (p.elabMarkDownPrice || {
                                            value: 0
                                        }).value
                                    ) * 100 /
                                    (p.price || {
                                        value: 0
                                    }).value
                                ).toFixed(0));
                            n.discount =
                                (p.elabMarkDownPrice || {
                                    value: 0
                                }).value === 0 ?
                                0 :
                                parseFloat((
                                    (p.price || {
                                        value: 0
                                    }).value -
                                    (p.elabMarkDownPrice || {
                                        value: 0
                                    }).value
                                ).toFixed(2));
                            return n;
                        })
                        .orderBy(["discountPercentage", "discount", "price.value", "name"], ["desc", "desc", "asc", "asc"])
                        .value();

                    dfd.resolve(newProducts);
                })

            return dfd.promise();
        }

        return {
            getBrands: getBrands,
            getProduct: getProduct
        };
    }

    function _uiWrapper() {

        function setupBrandSelectBox(element, brands) {
            brands.forEach(x =>
                element
                .append(
                    $("<option>")
                    .text(x.name)
                )
            );
            element
                .change(function() {
                    var entry = brands.find(x => x.name === element.val());
                    var codeItems = entry.brandUrl.split("/");
                    element.attr("data-brand-code", codeItems[codeItems.length - 2])
                    _controllerWrapper().onRefresh();
                });
        }

        function setupBrandList(element, data) {
            var brandGroup = _.groupBy(data.brands, (x) => x.name.slice(0, 1));
            for (var firstChar in brandGroup) {
                element
                    .append(
                        _setupMainItemButton(brandGroup, firstChar)
                    )
                    .append(
                        $("<div>")
                        .addClass("panel")
                        .append(
                            _setupSubList(brandGroup, firstChar)
                        )
                    );
            }

            function _setupMainItemButton(brandGroup, firstChar) {
                return $("<button>")
                    .addClass("accordion")
                    .text(firstChar)
                    .click(function() {
                        this.classList.toggle("active");

                        /* Toggle between hiding and showing the active panel */
                        var panel = this.nextElementSibling;
                        if (panel.style.display === "block") {
                            panel.style.display = "none";
                        } else {
                            panel.style.display = "block";
                        }
                    })
                    .append(
                        $("<div>")
                        .addClass("my-auto badge rounded-pill bg-primary text-white float-right")
                        .text(brandGroup[firstChar].length.toString())
                    );
            }

            function _setupSubList(brandGroup, firstChar) {
                return $("<ul>")
                    .addClass("my-1")
                    .append(
                        brandGroup[firstChar]
                        .map((x) => {
                            var items = x.brandUrl.split("/");

                            return $("<li>")
                                .addClass("mb-1")
                                .append(
                                    $("<button>")
                                    .attr("data-brand-code", items[items.length - 2]) // x.brandUrl.slice(0, x.brandUrl.lastIndexOf("/") + 1)
                                    .addClass("btn btn-outline-secondary btn-sm m-0")
                                    .text(x.name)
                                    .click(function(e) {
                                        $("#brandInput")
                                            .attr("data-brand-code", this.dataset.brandCode)
                                            .val(this.outerText);
                                        _controllerWrapper().onRefresh();
                                    })
                                );
                        })
                    )
            }

        }

        return {
            setupBrandSelectBox: setupBrandSelectBox,
            setupBrandList: setupBrandList
        };
    }

    function _controllerWrapper() {
        function onRefresh() {
            $.when(_dataWrapper().getProduct($("#brandInput").attr("data-brand-code"))).then(
                function(data) {
                    $("#productTable")
                        .empty()
                        .append(
                            $("<tr>")
                            .append($("<th>").text("Brand"))
                            .append($("<th>").text("Product ↓❹"))
                            .append($("<th>").text("Original Price (RM) ↓❸"))
                            .append($("<th>").text("Discount Price (RM)"))
                            .append($("<th>").text("Discount Percent (%) ↑❶"))
                            .append($("<th>").text("Discount (RM) ↑❷"))
                        )
                        .append(
                            data.map((p) => {
                                return $("<tr>")
                                    .append($("<td>").text((p.masterBrand || {}).name))
                                    .append($("<td>").text((p.name || "")))
                                    .append($("<td>").text((p.price || {}).value))
                                    .append($("<td>").text((p.elabMarkDownPrice || {}).value))
                                    .append($("<td>").text((p.discountPercentage || "")))
                                    .append($("<td>").text((p.discount || "")));
                            })
                        )
                }
            );
        }

        return {
            onRefresh: onRefresh
        };
    }

    function init() {
        $("#loaderSpinner").removeClass("d-none");
        $.when(_dataWrapper().getBrands())
            .then(
                function(data) {
                    var products = [];

                    _uiWrapper().setupBrandSelectBox($("#brandInput"), data.brands);
                    _uiWrapper().setupBrandList($("#brandList"), data);

                    $("#loadProgressTotal").text(data.brands.length);
                    $("#loadProgressWord").text("Loading : ");
                    data.brands.forEach((x, i) => {
                        var items = x.brandUrl.split("/");
                        $.when(_dataWrapper().getProduct(items[items.length - 2])).then(
                            function(serverData) {
                                var curr = $("#loadProgressValue").text();
                                var next = parseInt(curr) + 1;

                                products = products.concat(serverData.filter(x => x.discount > 0));
                                if (next >= data.brands.length) {
                                    $("#loaderSpinner").addClass("d-none");

                                    $("#loadProgressWord").text("Loaded : ");
                                    $("#loadProgressValue").text(data.brands.length);
                                    $("#loadProgressRemarks").text(` (${products.length} Products)`);
                                    $("#allProductTable")
                                        .empty()
                                        .append(
                                            $("<tr>")
                                            .append($("<th>").text("Brand"))
                                            .append($("<th>").text("Product ↓❹"))
                                            .append($("<th>").text("Original Price (RM) ↓❸"))
                                            .append($("<th>").text("Discount Price (RM)"))
                                            .append($("<th>").text("Discount Percent (%) ↑❶"))
                                            .append($("<th>").text("Discount (RM) ↑❷"))
                                        )
                                        .append(
                                            _.chain(products)
                                            .orderBy(["discountPercentage", "discount", "price.value", "name"], ["desc", "desc", "asc", "asc"])
                                            .map((p) => {
                                                return $("<tr>")
                                                    .append($("<td>").text((p.masterBrand || {}).name))
                                                    .append($("<td>").text((p.name || "")))
                                                    .append($("<td>").text((p.price || {}).value))
                                                    .append($("<td>").text((p.elabMarkDownPrice || {}).value))
                                                    .append($("<td>").text((p.discountPercentage || "")))
                                                    .append($("<td>").text((p.discount || "")));
                                            })
                                            .value()
                                        )
                                } else {
                                    $("#loadProgressValue").text(next);
                                }
                            },
                            function(status) {
                                console.log(status);
                            },
                            function() {}
                        );
                    });
                }
            );
    }

    return {
        init: init
    };
}