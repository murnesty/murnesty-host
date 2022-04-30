Murnesty = Murnesty || {};
Murnesty.Lunch = function() {

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
                    if (prev > next) {
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
            _setupMenuFoods(shop.foods);
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
            var table2 = document.getElementById("foodList");
            $("#foodNoHeader").click(() => sortTable(table2, 0));
            $("#foodNameHeader").click(() => sortTable(table2, 1));
            $("#foodPriceHeader").click(() => sortTable(table2, 2));
        } else {
            $("#foodList").empty();
        }
    }

    function init() {
        $.getJSON("/data/restaurant_list.json", function(shops) {
            _setupRestaurants(shops);
        });
    }

    return {
        init: init
    };
}