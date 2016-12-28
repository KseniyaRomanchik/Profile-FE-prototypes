function CabinetEdit(container) {

    var errors =
        [
            {
                selector: "#name",
                mess: "Это поле обязательно для заполнения",
                reg: /.+/i,
                req: true
            },
            {
                selector: "#phone",
                reg: /[^_]{16}/i,
                mess: "Укажите корректный номер телефона",
                req: false
            },
            {
                selector: "#email",
                reg: /.*[@]+.*[\.]+.*/ig,
                mess: "E-mail должен содержать “@” и “.”",
                req: false
            }
        ]

    function getData(link, callbackSuccess, callbackComplete, callbackError) {

        $.ajax({
            type: "GET",
            url: link,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {

                setTimeout(function () {

                    if (typeof (callbackSuccess) == "function") {

                        callbackSuccess(data);
                    }
                }, 1500)                
            },
            error: function (data, err, mess) {

                console.log("Error: " + err + ", message: " + mess);

                if (typeof (callbackError) == "function") {

                    callbackError();
                }
            },
            beforeSend: function () {

                if (typeof (callbackComplete) == "function") {

                    callbackComplete();
                }
            }
        });
    }

    function changeData() {

        window.location.hash = "";

        $(container + " input").on("input", function () {

            window.location.hash = "#change";
            $(container + " #save").removeClass("disabled");
        })
    }

    function maskInputs() {

        $('#phone').inputmask("375-99-999-99-99");
        $("#email").inputmask("Regex");
        $("#skype").inputmask("Regex");
        $("#linkedin").inputmask("Regex");
        $("#name").inputmask("Regex");
        $("#company").inputmask("Regex");
    }

    function validationView(input, regexp, message, req) {

        var inputValue = $(container + " " + input).val();
        var conditional;

        $(container + " " + input).removeClass("error").next(".error").remove();

        if (req) {

            conditional = !inputValue.match(regexp);
        }
        else {

            conditional = inputValue && !inputValue.match(regexp);
        }

        if (conditional) {

            $(container + " " + input).addClass("error").after("<span class='error'>" + message + "</span>");

            return false
        }
        return true
    }

    function validate(err, event) {

        var valid = err.map(function (it, ind) {

            return validationView(it.selector, it.reg, it.mess, it.req);
        });

        if (valid.indexOf(false) < 0 && event) {

            $(container + " #saveData").modal("show");
        }
    }

    function saveData() {

        $(document).on("click", container + " #save:not(.disabled)", function (e) {

            e.preventDefault();
            validate(errors, e);
        })
    }

    function cancelEdit() {

        $(container + " #cancel").on("click", function (e) {

            if (window.location.hash == "#change") {

                e.preventDefault();
                $(container + " #cancelData").modal("show");
            }
        })
    }

    function inputValidate() {

        $(document).on("input", container + " .validate.error", function (e) {

            validate(errors);
        })
    }

    function loadValidation(condition, target, lastTargetFile, result) {

        if (!condition) {

            if (result) {

                $(target).closest("label").next(".error").remove().end().after("<span class='error'>" + result + "</span>").fadeIn(200);

                if (lastTargetFile) {

                    target.blur();
                    target.files = lastTargetFile;
                }
                else {

                    target.value = "";
                }
            }
            return false
        }
        return true
    }

    function loadPhoto() {

        var lastFile;

        $(container + " #loadPhoto").on("change", function (e) {

            if (document.activeElement == e.target && e.target.files.length) {

                var imgs = e.target.files;
                var fileSize = (512 * 1024);
                var type = imgs[0].type.split("/")[1];
                var img = new FileReader();

                var isImage = loadValidation(imgs.length, e.target, lastFile);
                var isSize = loadValidation(imgs[0].size < fileSize, e.target, lastFile, "Вес файла не может превышать 0.5Mb");
                var isType = loadValidation(type == "jpeg" || type == "gif" || type == "bmp" || type == "png", e.target, lastFile, "Неверный формат файла. Выберите .jpeg, .png, .gif или .bmp");

                if (isImage && isSize && isType) {

                    $(e.target).closest("label").next(".error").remove();

                    setNewPhoto("#changePhoto", e.target, lastFile, function () {

                        lastFile = imgs;
                        startLoadingPhoto(img, imgs);
                        endLoadingPhoto(img, imgs);
                    });
                }
                else {
                    e.target.blur();
                    e.target.files = lastFile;
                }
            }
            else {

                e.target.blur();
                e.target.files = lastFile;
            }
        });
    }

    function setNewPhoto(modalId, inputField, lastFileInput, callback) {

        var isDefault = $(container + " #currentPhoto").attr("data-default");
        var modal = $(container + " " + modalId);
        var fieldFile = lastFileInput;

        if (isDefault) {

            callback();
            $(container + " #currentPhoto").attr("data-default", "");
        }
        else {

            modal.modal("show");

            modal.find(".saveModal").off("click").on("click", function () {

                if (typeof (callback) == "function") {

                    callback();
                }

                modal.modal("hide");
                fieldFile = inputField.files;
            });

            modal.on("hide.bs.modal", function () {

                inputField.blur();
                inputField.files = fieldFile;
            });
        }
    }

    function startLoadingPhoto(image, files) {

        image.onloadstart = (function (e) {

            $(container + " .photoWrapper").addClass("loading");
            $(container + " #currentPhoto").fadeOut(0);
        })(files[0]);
    }

    function endLoadingPhoto(image, files) {

        image.onloadend = (function () {

            return function (ev) {

                $(container + " #currentPhoto").attr("src", ev.target.result).fadeIn(300);
                $(container + " .photoWrapper").removeClass("loading");
            }
        })(files[0]);

        image.readAsDataURL(files[0]);
        $(container + " #save").removeClass("disabled");
    }

    function deletePhoto() {

        $(container + " #removePhotoButton").on("click", function () {

            var isDefault = $(container + " #currentPhoto").attr("data-default");

            if (!isDefault) {

                $(container + " #removePhoto").modal("show");
            }
        });
    }

    function confirmDeletePhoto() {

        $(container + " #removePhoto .saveModal:not(.disabled)").on("click", function () {

            var self = this;
            $(this).addClass("disabled");

            getData("../Scripts/Custom/jsonTest/photoUrl.json", function (d) {  // GETTING URL FOR DELETING PHOTO

                // d = { "defaultUrl": defaultPhotoUrl }

                $(container + " #loadPhoto").val("");
                $(container + " #currentPhoto").attr("src", d.defaultUrl);
                $(container + " #removePhotoPath").val("true");
                $(container + " #removePhoto").modal("hide");
                $(container + " #currentPhoto").attr("data-default", "default");
                $(self).removeClass("disabled");
            });
        });
    }

    return ({
        init: function () {

            maskInputs();
            saveData();
            inputValidate();
            cancelEdit();
            changeData();
            loadPhoto();
            deletePhoto();
            confirmDeletePhoto();
        }
    })
}

$(document).ready(function () {

    var cabinetEdit = CabinetEdit(".cabinet.edit").init();
})

