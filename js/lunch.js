Murnesty = Murnesty || {};
Murnesty.Lunch = function() {
    var foodList = [];

    function sortTable(table, n) {
        var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        // Set the sorting direction to ascending:
        dir = "asc";
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /* Check if the two rows should switch place,
                based on the direction, asc or desc: */
                var prev = x.innerHTML.toLowerCase();
                var next = y.innerHTML.toLowerCase();
                if ($(rows[i].getElementsByTagName("TD")[n]).hasClass("number")) {
                    prev = parseInt(prev);
                    next = parseInt(next);
                }
                if (dir == "asc") {
                    if (prev === "" && next !== "") {
                        shouldSwitch = true;
                        break;
                    } else if (prev > next && next !== "") {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (prev < next) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                // Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /* If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again. */
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    function _setupNotification(element, text) {
        // element.text(text);
        // element.addClass("active");
        // setTimeout(function() {
        //     element.removeClass("active");
        // }, 2000);
    }

    function _setupRestaurants(shops) {
        // Shop header
        $("#shopList").append(`
            <tr>
                <th id="shopNoHeader">No</th>
                <th id="shopNameHeader">Name</th>
                <th id="shopPriceHeader">Price</th>
            </tr>
        `);
        // Shop content
        for (let i = 0; i < shops.length; i++) {
            let shop = shops[i];
            $("#shopList").append(`
                <tr id="${shop.id}" class="shop-item">
                    <td class="number">${i + 1}</td>
                    <td>${shop.name}</th>
                    <td>${shop.priceRange}</th>
                </tr>
            `);
        }
        // Shop event
        $(".shop-item").click(function() {
            // Handle selected shop UI
            $(".shop-item").removeClass("active");
            $(this).addClass("active");

            // Handle selected detail UI
            var shop = shops.find(x => x.id == $(this).attr("id"));
            foodList = shop.foods;
            _setupMenuFoods(shop.foods);

            _setupNotification($("#shopNotification"), "Select food now");
        });
        var table = document.getElementById("shopList");
        $("#shopNoHeader").click(() => sortTable(table, 0));
        $("#shopNameHeader").click(() => sortTable(table, 1));
        $("#shopPriceHeader").click(() => sortTable(table, 2));
    }

    function _setupMenuFoods(foods) {
        if (foods != null) {
            // Food header
            $("#foodList")
                .empty()
                .append(`
                    <tr>
                    <th id="foodNoHeader">No</th>
                    <th id="foodNameHeader">Name</th>
                    <th id="foodPriceHeader">Price</th>
                    </tr>
                `);
            // Food content
            for (let j = 0; j < foods.length; j++) {
                let food = foods[j];

                $("#foodList")
                    .append(`
                        <tr class="food-item">
                            <td class="number">${j + 1}</td>
                            <td>${food.name}</th>
                            <td>${food.value}</th>
                        </tr>
                    `);
            }
            // Food event
            $(".food-item").click(function() {
                $(".food-item").removeClass("active");
                $(this).addClass("active");

                _setupNotification($("#foodNotification"), "Select user now");
            });
            var table = document.getElementById("foodList");
            $("#foodNoHeader").click(() => sortTable(table, 0));
            $("#foodNameHeader").click(() => sortTable(table, 1));
            $("#foodPriceHeader").click(() => sortTable(table, 2));
        } else {
            $("#foodList").empty();
        }
    }

    function _setupOrders(users) {
        if (users != null) {
            // User header
            $("#orderList")
                .empty()
                .append(`
                    <tr>
                        <th id="userNoHeader">No</th>
                        <th id="userNameHeader">Name</th>
                        <th id="userShopHeader">Shop</th>
                        <th id="userFoodHeader">Food</th>
                        <th id="userPriceHeader">Price</th>
                        <th id="userRemarkHeader">Remarks</th>
                    </tr>
                `);
            // User content
            for (let j = 0; j < users.length; j++) {
                let user = users[j];
                let row = $(`
                    <tr class="order-item">
                        <td class="number">${j + 1}</td>
                        <td>${user}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><input class="user-remark-input"></input></td>
                    </tr>
                `);
                row
                    .hover(function() {
                        var shopSelected = $(".shop-item.active");
                        var foodSelected = $(".food-item.active");
                        if (shopSelected.length > 0 && foodSelected.length > 0) {
                            var shopName = shopSelected.children()[1].innerText;
                            var foodName = foodSelected.children()[1].innerText;
                            var foodPrice = foodSelected.children()[2].innerText;
                            row.children()[2].innerText = shopName;
                            row.children()[3].innerText = foodName;
                            row.children()[4].innerText = foodPrice;
                            row.css("color", "gray");
                        }
                    })
                    .mouseleave(function() {
                        var shopName = row.attr("data-shopName");
                        var foodName = row.attr("data-foodName");
                        var foodPrice = row.attr("data-foodPrice");
                        row.children()[2].innerText = shopName || "";
                        row.children()[3].innerText = foodName || "";
                        row.children()[4].innerText = foodPrice || "";
                        row.css("color", "black");
                    });
                $("#orderList").append(row);
            }
            // User event
            $(".order-item").click(function() {
                var shopSelected = $(".shop-item.active");
                var foodSelected = $(".food-item.active");
                if (foodSelected.length === 1) {
                    var shopName = shopSelected.children()[1].innerText;
                    var foodName = foodSelected.children()[1].innerText;
                    var foodPrice = foodSelected.children()[2].innerText;
                    if ($(this).attr("data-shopName") == undefined &&
                        $(this).attr("data-foodName") == undefined) {
                        $(this).children()[2].innerText = shopName;
                        $(this).children()[3].innerText = foodName;
                        $(this).children()[4].innerText = foodPrice;
                    } else if ($(this).attr("data-shopName") !== $(this).children()[2].innerText ||
                        $(this).attr("data-foodName") !== $(this).children()[3].innerText) {
                        $("#modalOrderName").text($(this).children()[1].innerText);
                        $("#modalFoodFrom").text($(this).children()[2].innerText);
                        $("#modalFoodTo").text(foodName);
                        $('#confirmFoodOrderModal').modal("show");
                        var tableRow = $(this);
                        $('#modalOkButton').click(function() {
                            tableRow.children()[2].innerText = shopName;
                            tableRow.children()[3].innerText = foodName;
                            tableRow.children()[4].innerText = foodPrice;
                            $('#confirmFoodOrderModal').modal("hide");
                        });
                    }
                    $(this).attr({
                        "data-shopName": shopName,
                        "data-foodName": foodName,
                        "data-foodPrice": foodPrice
                    });
                }
            });
            var table = document.getElementById("orderList");
            $("#userNoHeader").click(() => sortTable(table, 0));
            $("#userNameHeader").click(() => sortTable(table, 1));
            $("#userShopHeader").click(() => sortTable(table, 2));
            $("#userFoodHeader").click(() => sortTable(table, 3));
            $("#userPriceHeader").click(() => sortTable(table, 4));
            $(".user-remark-input").click((event) => {
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }
    }

    function init() {
        $.getJSON('@Url.Content("~/data/restaurant_list.json")', function(shops) {
            _setupRestaurants(shops);
        });

        $.getJSON('@Url.Content("~/data/user_list.json")', function(users) {
            _setupOrders(users);
        });
    }

    return {
        init: init
    };
}