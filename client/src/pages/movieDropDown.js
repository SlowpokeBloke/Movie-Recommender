import axios from 'axios';
import './UserAccount.css';

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    console.log("toggling dropdown");
}

function filterFunction() {
    var input, filter, ul, li, a, i, div, txtValue;
    input = document.getElementById("myInput");
    console.log("element retrieved by id: " + input);
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
        } else {
        a[i].style.display = "none";
        }
    }
}