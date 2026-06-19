const form = document.getElementById("subscriptionForm");
const subscriptionList = document.getElementById("subscriptionList");

let subscriptions = [];

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const plan = document.getElementById("plan").value;

    const subscription = {
        id: Date.now(),
        name,
        plan,
        status: "Active"
    };

    subscriptions.push(subscription);

    displaySubscriptions();

    form.reset();
});

function displaySubscriptions() {

    subscriptionList.innerHTML = "";

    subscriptions.forEach(sub => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sub.name}</td>
            <td>${sub.plan}</td>
            <td class="${sub.status === "Active" ? "active" : "cancelled"}">
                ${sub.status}
            </td>
            <td>
                ${
                    sub.status === "Active"
                    ? `<button class="cancel-btn"
                        onclick="cancelSubscription(${sub.id})">
                        Cancel
                       </button>`
                    : "Cancelled"
                }
            </td>
        `;

        subscriptionList.appendChild(row);
    });
}

function cancelSubscription(id) {

    subscriptions = subscriptions.map(sub => {
        if (sub.id === id) {
            return {
                ...sub,
                status: "Cancelled"
            };
        }
        return sub;
    });

    displaySubscriptions();
}