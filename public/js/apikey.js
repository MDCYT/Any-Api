document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var elemsTooltipped = document.querySelectorAll(".tooltipped");
  var instancesTooltipped = M.Tooltip.init(elemsTooltipped);
  var instances = M.FormSelect.init(elems);
});

$("#submit").click(function () {
  //Check if everything is filled
  var tier = $("#tier");
  var price = tier.find(":selected").text();
  //Choose first element in the price string
  if (price) price = price.split(" ")[0];
  var name = $("#nameproject").val();
  var email = $("#inputEmail").val();
  var projectid = $("#projectid");
  var typeOfProject = projectid.find(":selected").text();

  if (
    name === "" ||
    email === "" ||
    price === "" ||
    typeOfProject === "" ||
    typeOfProject === "Choose your option" ||
    price === "Choose your tier"
  ) {
    M.toast({ html: "Please fill all the fields", classes: "red" });
    return;
  }

  
  const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  //Check if the email is valid
  if (!validateEmail(email)) {
    M.toast({ html: "Please enter a valid email", classes: "red" });
    return;
  }


  //Redirect to the payment page
  window.location.href =
    "/payment?name=" +
    name +
    "&email=" +
    email +
    "&price=" +
    price +
    "&typeOfProject=" +
    typeOfProject;
});
