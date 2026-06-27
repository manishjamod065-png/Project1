/* ==========================================
   SUBSCRIPTION MANAGEMENT SYSTEM
========================================== */

let subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

let editIndex = -1;

/* ==========================================
   DOM ELEMENTS
========================================== */

const form = document.getElementById("subscriptionForm");

const service = document.getElementById("service");

const category = document.getElementById("category");

const price = document.getElementById("price");

const billing = document.getElementById("billing");

const renewal = document.getElementById("renewal");

const payment = document.getElementById("payment");

const status = document.getElementById("status");

/* ==========================================
   SAVE LOCAL STORAGE
========================================== */

function saveData(){

    localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
    );

}

/* ==========================================
   LOAD DATA
========================================== */

window.onload = function(){

    renderTable();

    updateDashboard();

    updateReports();

    loadRecentRenewals();

};

/* ==========================================
   FORM SUBMIT
========================================== */

form.addEventListener("submit",function(e){

    e.preventDefault();

    const subscription={

        service:service.value.trim(),

        category:category.value,

        price:Number(price.value),

        billing:billing.value,

        renewal:renewal.value,

        payment:payment.value,

        status:status.value

    };

    /* EDIT */

    if(editIndex!==-1){

        subscriptions[editIndex]=subscription;

        editIndex=-1;

    }

    /* ADD */

    else{

        subscriptions.push(subscription);

    }

    saveData();

    renderTable();

    updateDashboard();

    updateReports();

    loadRecentRenewals();

    form.reset();

});

/* ==========================================
   EDIT DATA
========================================== */

function editSubscription(index){

    const item=subscriptions[index];

    service.value=item.service;

    category.value=item.category;

    price.value=item.price;

    billing.value=item.billing;

    renewal.value=item.renewal;

    payment.value=item.payment;

    status.value=item.status;

    editIndex=index;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================================
   DELETE DATA
========================================== */
/* Continue in Part 2 */
/* ==========================================
   DELETE DATA
========================================== */

function deleteSubscription(index){

    if(confirm("Are you sure you want to delete this subscription?")){

        subscriptions.splice(index,1);

        saveData();

        renderTable();

        updateDashboard();

        updateReports();

        loadRecentRenewals();

    }

}

/* ==========================================
   STATUS BADGE
========================================== */

function getStatusBadge(status){

    const value=status.toLowerCase();

    return `<span class="status ${value}">${status}</span>`;

}

/* ==========================================
   RENDER TABLE
========================================== */

function renderTable(data=subscriptions){

    const table=document.getElementById("subscriptionTable");

    table.innerHTML="";

    if(data.length===0){

        table.innerHTML=`

        <tr>

            <td colspan="7" class="text-center">

                No Subscription Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((item,index)=>{

        table.innerHTML+=`

        <tr>

            <td>${item.service}</td>

            <td>${item.category}</td>

            <td>₹${item.price}</td>

            <td>${item.billing}</td>

            <td>${item.renewal}</td>

            <td>

                ${getStatusBadge(item.status)}

            </td>

            <td>

                <button

                    class="action-btn edit-btn"

                    onclick="editSubscription(${index})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button

                    class="action-btn delete-btn"

                    onclick="deleteSubscription(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/* ==========================================
   SEARCH
========================================== */

const tableSearch=document.getElementById("tableSearch");

tableSearch.addEventListener("keyup",function(){

    const keyword=this.value.toLowerCase();

    const filtered=subscriptions.filter(item=>{

        return(

            item.service.toLowerCase().includes(keyword) ||

            item.category.toLowerCase().includes(keyword)

        );

    });

    renderTable(filtered);

});

/* ==========================================
   FILTER CATEGORY
========================================== */

const filterCategory=document.getElementById("filterCategory");

filterCategory.addEventListener("change",applyFilters);

/* ==========================================
   FILTER STATUS
========================================== */

const filterStatus=document.getElementById("filterStatus");

filterStatus.addEventListener("change",applyFilters);

/* ==========================================
   SORT
========================================== */

const sortRenewal=document.getElementById("sortRenewal");

sortRenewal.addEventListener("change",applyFilters);

/* ==========================================
   APPLY FILTERS
========================================== */

function applyFilters(){

    let data=[...subscriptions];

    const categoryValue=filterCategory.value;

    const statusValue=filterStatus.value;

    if(categoryValue!=="All"){

        data=data.filter(item=>

            item.category===categoryValue

        );

    }

    if(statusValue!=="All"){

        data=data.filter(item=>

            item.status===statusValue

        );

    }

    data.sort((a,b)=>{

        if(sortRenewal.value==="asc"){

            return new Date(a.renewal)-new Date(b.renewal);

        }

        return new Date(b.renewal)-new Date(a.renewal);

    });

    renderTable(data);

}

/* ==========================================
   Continue in Part 3
========================================== */
/* ==========================================
   DASHBOARD STATISTICS
========================================== */

function updateDashboard(){

    let total = subscriptions.length;

    let active = 0;

    let monthly = 0;

    let yearly = 0;

    let upcoming = 0;

    let expired = 0;

    const today = new Date();

    subscriptions.forEach(item=>{

        if(item.status==="Active"){

            active++;

        }

        const amount = Number(item.price);

        switch(item.billing){

            case "Monthly":
                monthly += amount;
                yearly += amount * 12;
                break;

            case "Quarterly":
                yearly += amount * 4;
                monthly += (amount * 4) / 12;
                break;

            case "Half Yearly":
                yearly += amount * 2;
                monthly += (amount * 2) / 12;
                break;

            case "Yearly":
                yearly += amount;
                monthly += amount / 12;
                break;
        }

        const renewalDate = new Date(item.renewal);

        const diff =
        Math.ceil(
            (renewalDate - today) /
            (1000*60*60*24)
        );

        if(diff>=0 && diff<=30){

            upcoming++;

        }

        if(item.status==="Expired"){

            expired++;

        }

    });

    document.getElementById("totalSubscriptions").innerText = total;

    document.getElementById("activeSubscriptions").innerText = active;

    document.getElementById("monthlyExpense").innerText =
    "₹"+monthly.toFixed(2);

    document.getElementById("yearlyExpense").innerText =
    "₹"+yearly.toFixed(2);

    document.getElementById("upcomingRenewals").innerText =
    upcoming;

    document.getElementById("expiredSubscriptions").innerText =
    expired;

}

/* ==========================================
   REPORTS
========================================== */

function updateReports(){

    let monthly = 0;

    let yearly = 0;

    let categorySet = new Set();

    let renewals = 0;

    const today = new Date();

    subscriptions.forEach(item=>{

        const amount = Number(item.price);

        categorySet.add(item.category);

        switch(item.billing){

            case "Monthly":

                monthly += amount;

                yearly += amount * 12;

                break;

            case "Quarterly":

                yearly += amount * 4;

                monthly += (amount * 4)/12;

                break;

            case "Half Yearly":

                yearly += amount * 2;

                monthly += (amount * 2)/12;

                break;

            case "Yearly":

                yearly += amount;

                monthly += amount/12;

                break;

        }

        const days =
        Math.ceil(

            (new Date(item.renewal)-today)

            /(1000*60*60*24)

        );

        if(days>=0 && days<=30){

            renewals++;

        }

    });

    document.getElementById("reportMonthly").innerText =
    "₹"+monthly.toFixed(2);

    document.getElementById("reportYearly").innerText =
    "₹"+yearly.toFixed(2);

    document.getElementById("categoryCount").innerText =
    categorySet.size;

    document.getElementById("renewalCount").innerText =
    renewals;

}

/* ==========================================
   RECENT RENEWALS
========================================== */

function loadRecentRenewals(){

    const tbody =
    document.getElementById("recentRenewals");

    tbody.innerHTML="";

    if(subscriptions.length===0){

        tbody.innerHTML=`

        <tr>

        <td colspan="4"

        class="text-center">

        No Data Available

        </td>

        </tr>

        `;

        return;

    }

    const sorted=[...subscriptions].sort((a,b)=>

        new Date(a.renewal)-

        new Date(b.renewal)

    );

    sorted.slice(0,5).forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>

                ${item.service}

            </td>

            <td>

                ${item.renewal}

            </td>

            <td>

                ₹${item.price}

            </td>

            <td>

                ${getStatusBadge(item.status)}

            </td>

        </tr>

        `;

    });

}

/* ==========================================
   INITIAL LOAD
========================================== */

renderTable();

updateDashboard();

updateReports();

loadRecentRenewals();

/* ==========================================
   END OF FILE
========================================== */