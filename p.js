const form = document.getElementById("subscriptionForm");

const serviceInput = document.getElementById("service");
const priceInput = document.getElementById("price");
const renewalInput = document.getElementById("renewalDate");

const list = document.getElementById("subscriptionList");

let subscriptions =
    JSON.parse(localStorage.getItem("subscriptions")) || [];

renderSubscriptions();

form.addEventListener("submit", function(e){

    e.preventDefault();

    const subscription = {

        service: serviceInput.value,

        price: Number(priceInput.value),

        renewalDate: renewalInput.value

    };

    subscriptions.push(subscription);

    saveData();

    form.reset();

    renderSubscriptions();

});

function renderSubscriptions(){

    list.innerHTML = "";

    let totalExpense = 0;

    subscriptions.forEach((sub,index)=>{

        totalExpense += sub.price;

        list.innerHTML += `

        <tr>

            <td>${sub.service}</td>

            <td>₹${sub.price}</td>

            <td>${sub.renewalDate}</td>

            <td>

                <button
                class="btn btn-danger btn-sm"
                onclick="deleteSubscription(${index})">

                Delete

                </button>

            </td>

        </tr>

        `;
    });

    document.getElementById("totalSubs").innerText =
    subscriptions.length;

    document.getElementById("activeSubs").innerText =
    subscriptions.length;

    document.getElementById("totalExpense").innerText =
    totalExpense;

}

function deleteSubscription(index){

    subscriptions.splice(index,1);

    saveData();

    renderSubscriptions();

}

function saveData(){

    localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
    );

}