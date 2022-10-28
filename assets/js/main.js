let data = $('#data');
let sideFlag = false;
let lc = $(".loading-container");
let arr = [];

let navWidth = $(".side-menu").width() - 10;

let userName,
    userEmail,
    userPhone,
    userAge,
    userPassword,
    userRePassword;

class Meals {
    constructor(data) {
        this.data = data;
        this.apiBase = 'https://www.themealdb.com/api/json/v1/1/';
        this.search("").then(() => {
            $(".loading-screen").fadeOut(500, () => {
                $("body").css("overflow", "visible");
            })
        })

    }

    async getMeal(mealID) {
        lc.fadeIn(100)
        let meal = await fetch(`${this.apiBase}lookup.php?i=${mealID}`)
        meal = await meal.json()
        this.displayMeal(meal.meals[0])
        lc.fadeOut(500)
    }

    displayMeals(array) {
        let cartoona = ``;
        $(array).each(function () {
            cartoona += `<div class="col-md-6 col-lg-3 my-3  pointer">
                <div class="meal  rounded position-relative" onclick="meals.getMeal('${this.idMeal}')">
                    <img src="${this.strMealThumb}" class="w-100 rounded">
                    <div class="layer d-flex align-items-center ">
                        <div class="info p-2">
                            <h2>${this.strMeal}</h2>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        this.data.html(cartoona);
        scrolltop();
    }
    async search(q) {
        lc.fadeIn(100)
        let meals = await fetch(`${this.apiBase}search.php?s=${q}`)
        meals = await meals.json()
        this.displayMeals(meals.meals)
        lc.fadeOut(400)
        return meals
    }

    displayMeal(meal) {
        let recipes = ""

        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                recipes += `<li class="my-3 mx-1 p-1 alert alert-success rounded">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
            }
        }
        let cartoona = "";
        let tags = meal.strTags?.split(","); // works ?
        $(tags).each(function (index) {
            cartoona += `<li class="my-3 mx-1 p-1 alert alert-danger rounded">${this}</li>`;
        });

        let html = `
        <div class="col-md-4 text-white">
    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset=""><br>
    <h1>${meal.strMeal}</h1>
</div>
<div class="col-md-8 text-white text-left">
    <h2>Instructions</h2>
    <p>${meal.strInstructions}</p>
    <p><b class="fw-bolder">Area :</b> ${meal.strArea}</p>
    <p><b class="fw-bolder">Category :</b> ${meal.strCategory}</p>
    <h3>Recipes :</h3>
    <ul class="d-flex flex-wrap" id="recipes">
    </ul>

    <h3 class="my-2 mx-1 p-1">Tags :</h3>
    <ul class="d-flex " id="tags">
    </ul>


    <a class="btn btn-success text-white" target="_blank" href="${meal.strSource}">Source</a>
    <a class="btn youtube text-white" target="_blank" href="${meal.strYoutube}">Youtube</a>
</div>`
        data.html(html);
        $('#recipes').html(recipes);
        $("#tags").html(cartoona);
        scrolltop();

    }

    async getCategories(listBy) {
        let x;
        x = await fetch(`${this.apiBase}${listBy}`);
        x = await x.json()
        return x;

    }

    displayCategories() {
        let cartoona = '';
        $(arr).each(function () {
            cartoona += `
            <div class="col-md-6 col-lg-3 my-3 ">
                <div class="meal  rounded position-relative pointer">
                    <div onclick="meals.filterByCategory('${this.strCategory}')">
                        <img src='${this.strCategoryThumb}' class="w-100 rounded" />
                        <div class="layer d-flex align-items-center ">
                            <div class="p-2">
                                <h2>${this.strCategory}</h2>
                                <p class="fw-light">${this.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        this.data.html(cartoona);
        scrolltop();
    }

    async filterByCategory(c) {
        lc.fadeIn(100)
        let meals = await fetch(`${this.apiBase}filter.php?c=${c}`)
        meals = await meals.json()
        this.displayMeals(meals.meals)
        lc.fadeOut(500)
    }

    async searchByLetter(l) {
        if (l) {
            lc.fadeIn(100)
            let meals = await fetch(`${this.apiBase}search.php?f=${l}`)
            meals = await meals.json()
            if (meals.meals) {
                this.displayMeals(meals.meals)
            }
            lc.fadeOut(100)
        }
    }
    displayArea() {
        let cartoona = '';
        $(arr).each(function () {
            cartoona += `
            <div class="col-md-6 col-lg-3 my-3 pointer ">
                <div class="movie  rounded position-relative">
                    <div onclick="meals.area('${this.strArea}')">
                        <i class="fa-solid fa-city fa-3x"></i>
                        <h2 class="text-white">${this.strArea}</h2>
                    </div>
                </div>
            </div>`;
        });
        this.data.html(cartoona);
        scrolltop();

    }

    async area(area) {
        lc.fadeIn(100)
        let meals = await fetch(`${this.apiBase}filter.php?a=${area}`)
        meals = await meals.json()
        this.displayMeals(meals.meals.slice(0, 20))
        lc.fadeOut(500)
    }

    displayIngredients() {

        let cartoona = '';
        $(arr).each(function () {
            cartoona += `
        <div class="col-md-6 col-lg-3 my-3 pointer">
            <div onclick="meals.ingredient('${this.strIngredient}')" class="meal  rounded position-relative">
                <div>
                    <i class="fa-solid fa-bowl-food fa-3x"></i>
                    <h2 class="text-white">${this.strIngredient}</h2>
                    <p class="text-white">${this.strDescription.split(" ").splice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
        });
        this.data.html(cartoona);
        scrolltop();
    }
    async ingredient(mealName) {
        lc.fadeIn(100)
        let meal = await fetch(`${this.apiBase}filter.php?i=${mealName}`)
        meal = await meal.json()
        this.displayMeals(meal.meals)
        lc.fadeOut(500)
    }

}


$(".side-toggle-menu").click(function () {
    if (!sideFlag) {
        sideFlag = true;
        $(".side-menu li").each(function (index) {
            $(this).animate({
                opacity: "1",
                paddingTop: "25px"
            }, 1000 + (100 * index));
        });
        $('.strip-side-nav').css('left', navWidth);
        $(".fa-align-justify").toggleClass("fa-times");
        $('.side-menu').removeClass('closed').addClass('opened');
    } else {
        sideFlag = false;
        $(".side-menu li").animate({
            opacity: "0",
            paddingTop: "500px"
        }, 500);
        $('.strip-side-nav').css('left', 0);
        $(".fa-align-justify").toggleClass("fa-times");
        $('.side-menu').removeClass('opened').addClass('closed');
    }
});
$(".side-items ul li a").click(async function (e) {
    if (sideFlag) {
        $(".side-toggle-menu").trigger('click');
    }
    let listBy = $(this).data('list');
    $('#search-container').html('');
    data.html('');
    scrolltop();

    if (listBy == 'contact') {
        data.html(`
        <section id="contact" class="container myM w-75 mx-auto mb-5 ">
		<div class="p-2">
			<h2 class="text-light mb-5">ContacUs...</h2>
			<div class="row">
				<div class="col-md-6">
					<div class="form-group">
						<input class="form-control  bg-black text-white border border-0 border-bottom my-1" onkeyup="validation()" id="name"
							placeholder="Enter Your Name">
						<div class="alert mt-1 alert-danger d-none" id="namealert" role="alert">
							Special Characters and Numbers not allowed
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
						<input onkeyup="validation()" class="form-control bg-black text-white border border-0 border-bottom my-1" id="email" placeholder="Enter Email">
						<div class="alert mt-1 alert-danger d-none" id="emailalert" role="alert">
							Enter valid email. *Ex: xxx@yyy.zzz
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
						<input onkeyup="validation()" class="form-control bg-black text-white border border-0 border-bottom my-1" id="phone" placeholder="Enter phone">
						<div class="alert mt-1 alert-danger  d-none" id="phonealert" role="alert">
							Enter valid Phone Number
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
						<input onkeyup="validation()" class="form-control bg-black text-white border border-0 border-bottom my-1" id="age" placeholder="Enter Age">
						<div class="alert mt-1 alert-danger  d-none" id="agealert" role="alert">
							Enter valid Age
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
						<input onkeyup="validation()" class="form-control bg-black text-white border border-0 border-bottom my-1" type="password" id="password"
							placeholder="Enter Password">
						<div class="alert mt-1 alert-danger  d-none" id="passwordalert" role="alert">
							Enter valid password *Minimum eight characters, at least one letter and one number:*
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="form-group">
						<input onkeyup="validation()" class="form-control bg-black text-white border border-0 border-bottom my-1" type="password" id="rePassword"
							placeholder="Enter RePassword">
						<div class="alert mt-1 alert-danger  d-none" id="repasswordalert" role="alert">
							Enter valid Repassword
						</div>
					</div>
				</div>


			</div>

			<button type="submit" disabled id="submitBtn" class="btn btn-outline-danger">Submit</button>
		</div>

	    </section>`);

        $("#name").focus(function (e) {
            nameToached = true;
        });
        $("#email").focus(function (e) {
            emailToached = true;
        });
        $("#phone").focus(function (e) {
            phoneToached = true;
        });
        $("#age").focus(function (e) {
            ageToached = true;
        });
        $("#password").focus(function (e) {
            passwordToached = true;
        });
        $("#rePassword").focus(function (e) {
            repasswordToached = true;
        });



    }
    if (listBy == "search") {
        data.html("");
        $('.search-container').html('');
        document.getElementById("search-container").innerHTML = `
        <div class="row">
				<div class="col-md-6"><input id="searchInput" class="form-control bg-black text-white border border-0 border-bottom my-1 mb-2 " placeholder="Search By Name">
				</div>
				<div class="col-md-6">
					<input class="form-control bg-black text-white border border-0 border-bottom my-1" type="text" maxlength="1" id="letter"
						placeholder="search By First Letter...">
				</div>

			</div>`

        $("#searchInput").keyup((e) => {
            meals.search(e.target.value)
        })
        $("#letter").keyup((e) => {
            meals.searchByLetter(e.target.value)
        })

        $('#letter').on("input", function () {
            if (this.value.length > 1)
                this.value = this.value.slice(0, 1);
        });
    }
    if (listBy == "categories") {
        lc.fadeIn(100)

        x = await meals.getCategories(listBy + ".php")
        arr = x.categories.splice(0, 20);
        meals.displayCategories()
        lc.fadeOut(500)
    } else if (listBy == "a") {
        lc.fadeIn(100)

        x = await meals.getCategories("list.php?a=list")
        arr = x.meals.splice(0, 20);
        meals.displayArea()
        lc.fadeOut(500)
    } else if (listBy == "i") {
        lc.fadeIn(100)

        x = await meals.getCategories("list.php?i=list")
        arr = x.meals.splice(0, 20);
        meals.displayIngredients()
        lc.fadeOut(500)
    }
});

const meals = new Meals(data);


function scrolltop() {
    $("html, body").animate({
        scrollTop: 0
    }, 200);
}
$("#name").focus(function (e) {
    nameToached = true;
});
$("#email").focus(function (e) {
    emailToached = true;
});
$("#phone").focus(function (e) {
    phoneToached = true;
});
$("#age").focus(function (e) {
    ageToached = true;
});
$("#password").focus(function (e) {
    passwordToached = true;
});
$("#rePassword").focus(function (e) {
    repasswordToached = true;
});
let nameToached = false,
    emailToached = false,
    phoneToached = false,
    ageToached = false,
    passwordToached = false,
    repasswordToached = false;

function validation() {
    if (nameToached) {
        if (validateName()) {
            $("#name").removeClass("is-invalid").addClass("is-valid");
            $("#namealert").removeClass("d-block").addClass("d-none");

        } else {
            $("#name").removeClass("is-valid").addClass("is-invalid");
            $("#namealert").removeClass("d-none").addClass("d-block");
        }
    }

    if (emailToached) {
        if (userEmailValid()) {
            $("#email").removeClass("is-invalid").addClass("is-valid");
            $("#emailalert").removeClass("d-block").addClass("d-none");
        } else {
            $("#email").removeClass("is-valid").addClass("is-invalid");
            $("#emailalert").removeClass("d-none").addClass("d-block");
        }
    }

    if (phoneToached) {
        if (userPhoneValid()) {
            $("#phone").removeClass("is-invalid").addClass("is-valid");
            $("#phonealert").removeClass("d-block").addClass("d-none");
        } else {
            $("#phone").removeClass("is-valid").addClass("is-invalid");
            $("#phonealert").removeClass("d-none").addClass("d-block");
        }
    }

    if (ageToached) {
        if (userAgeValid()) {
            $("#age").removeClass("is-invalid").addClass("is-valid");
            $("#agealert").removeClass("d-block").addClass("d-none");
        } else {
            $("#age").removeClass("is-valid").addClass("is-invalid");
            $("#agealert").removeClass("d-none").addClass("d-block");
        }
    }

    if (passwordToached) {
        if (userPasswordValid()) {
            $("#password").removeClass("is-invalid").addClass("is-valid");
            $("#passwordalert").removeClass("d-block").addClass("d-none");
        } else {
            $("#password").removeClass("is-valid").addClass("is-invalid");
            $("#passwordalert").removeClass("d-none").addClass("d-block");
        }
    }

    if (repasswordToached) {
        if (userRePasswordValid()) {
            $("#rePassword").removeClass("is-invalid").addClass("is-valid");
            $("#repasswordalert").removeClass("d-block").addClass("d-none");
        } else {
            $("#rePassword").removeClass("is-valid").addClass("is-invalid");
            $("#repasswordalert").removeClass("d-none").addClass("d-block");
        }
    }

    if (validateName() && userEmailValid() && userPhoneValid() && userAgeValid() && userPasswordValid() && userRePasswordValid()) {
        $('#submitBtn').removeAttr('disabled');
    } else {
        $('#submitBtn').attr('disabled', 'true');
    }

}

function validateName() {
    return /^[a-zA-Z ]+$/.test($("#name").val())
}

function userEmailValid() {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#email").val())
}

function userPhoneValid() {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phone").val())
}

function userAgeValid() {
    return /^[1-9][0-9]?$|^100$/.test($("#age").val())
}

function userPasswordValid() {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test($("#password").val())
}

function userRePasswordValid() {
    return $("#password").val() == $("#rePassword").val()
}