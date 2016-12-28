function mask(selector, regexp, allowedSymb) {

    $(selector).on("input", function (e) {

        e.target.value = e.target.value.replace(regexp, "");

        if (e.target.value.length > allowedSymb) {

            e.target.value = e.target.value.substring(0, allowedSymb);
        }
    });
}