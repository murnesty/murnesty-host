Murnesty = Murnesty || {};
Murnesty.Lunch = function() {
    var shops = [{
        id: "s11",
        name: "S11",
        priceRange: "RM10-"
    }, {
        id: "korea",
        name: "Korea",
        priceRange: "RM10-"
    }, {
        id: "gouw",
        name: "Gouw",
        priceRange: "RM10-"
    }, {
        id: "ss3_mj",
        name: "SS3 MJ",
        priceRange: "RM10-"
    }, {
        id: "double_joy",
        name: "Double Joy",
        priceRange: "RM10-20"
    }, {
        id: "boran",
        name: "Boran",
        priceRange: "RM10-20"
    }, {
        id: "tang_pin",
        name: "Tang Pin",
        priceRange: "RM10-20"
    }, {
        id: "mcd",
        name: "MCD",
        priceRange: "RM10-20"
    }, {
        id: "ribs_king",
        name: "Ribs King",
        priceRange: "RM10-20"
    }, {
        id: "spades_burger",
        name: "Spade's Burger",
        priceRange: "RM20+"
    }];

    function sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("shopList");
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

    function _setupRestaurantShops() {
        $("#shopList").append(`
            <tr>
                <th id="shopNoHeader">No</th>
                <th id="shopNameHeader">Name</th>
                <th id="shopPriceHeader">Price</th>
            </tr>
        `);

        for (let i = 0; i < shops.length; i++) {
            let shop = shops[i];

            $("#shopList").append(`
                <tr id="${shop.id}" class="shop-item">
                    <td class="number">${i + 1}</td>
                    <td>${shop.name}</th>
                    <td>${shop.priceRange}</th>
                </tr>
            `);

            $("#menu").append(`
                <div id=${shop.id}_menu class="menu-item" style="display: none;">
                    ${shop.name}
                </div>
            `);
        }
    }

    function _setupEvents() {
        // TODO : view type button group
        // $(".restaurant-view-btn").click(function(event) {

        //     console.log("click..");

        //     $(".restaurant-view-btn").removeClass("active");
        //     $(event.currentTarget).addClass("active");
        // });

        $(".shop-item").click(function() {
            //alert("click " + $(this).attr("id"));
            $(".menu-item").hide();
            $("#" + $(this).attr("id") + "_menu").show();
        });

        $("#shopNoHeader").click(() => sortTable(0));
        $("#shopNameHeader").click(() => sortTable(1));
        $("#shopPriceHeader").click(() => sortTable(2));


        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
    }

    function init() {
        _setupRestaurantShops();
        _setupEvents();
    }

    return {
        init: init
    };
}