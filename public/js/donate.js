document["addEventListener"]("DOMContentLoaded", function () {
  var itemData = document["querySelectorAll"](".collapsible");
  var reverseItemData = M["Collapsible"]["init"](itemData);
});

//JQuery
//Copy the text in .copy to the clipboard when the .copy text is clicked
$(".copy").click(function () {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(this).text()).select();
  document.execCommand("copy");
  $temp.remove();
  Swal.fire({
    title: "Copied!",
    text: "The text has been copied to your clipboard.",
    icon: "success",
    confirmButtonText: "OK",
  });
});
