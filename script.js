const form = document.getElementById('form');
const list = document.getElementById('list');
const total = document.getElementById('total');
const filter = document.getElementById('filter');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function updateUI() {
    list.innerHTML = "";
    let sum = 0;

    let filtered = expenses.filter(exp =>
        filter.value === "All" || exp.category === filter.value
    );

    filtered.forEach((exp, index) => {
        sum += exp.amount;

        const li = document.createElement('li');
        li.innerHTML = `
            ${exp.text} - ₹${exp.amount} [${exp.category}]
            <button onclick="deleteExpense(${index})">❌</button>
        `;
        list.appendChild(li);
    });

    total.innerText = sum;
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateChart();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const text = document.getElementById('text').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const month = document.getElementById('month').value;

    expenses.push({ text, amount, category, month });

    updateUI();
    form.reset();
});

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI();
}

filter.addEventListener('change', updateUI);

function updateChart() {
    const categories = ["Food", "Travel", "Bills", "Shopping"];
    let data = categories.map(cat =>
        expenses.filter(e => e.category === cat)
                .reduce((sum, e) => sum + e.amount, 0)
    );

    if(window.myChart) window.myChart.destroy();

    const ctx = document.getElementById('chart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: data
            }]
        }
    });
}

updateUI();