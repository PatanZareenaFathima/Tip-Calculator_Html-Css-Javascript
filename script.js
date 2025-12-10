 function calculateTip() {
  const billAmount = parseFloat(document.getElementById('billAmount').value);
  const tipPercent = parseFloat(document.getElementById('tipPercent').value);
  const people = parseInt(document.getElementById('people').value);

  if (!billAmount || !tipPercent || !people || people <= 0) {
    alert('Please enter valid inputs.');
    return;
  }

  const totalTip = (billAmount * tipPercent) / 100;
  const totalAmount = billAmount + totalTip;
  const tipPerPerson = totalTip / people;
  const totalPerPerson = totalAmount / people;

  // Update the DOM with calculated values
  document.getElementById('tipAmount').textContent = `$${tipPerPerson.toFixed(2)}`;
  document.getElementById('totalAmount').textContent = `$${totalPerPerson.toFixed(2)}`;
  document.getElementById('totalBill').textContent = `$${totalAmount.toFixed(2)}`;

  // Send data to backend
  const tipData = {
    billAmount,
    tipPercent,
    numberOfPeople: people,
    totalTip,
    totalAmount
  };

  // Make POST request to save the tip calculation
  fetch('http://localhost:5000/api/tips', {  // Use your actual backend port
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tipData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save tip');
      }
      return response.json();
    })
    .then(data => console.log('Tip saved:', data))
    .catch(error => console.error('Error:', error));
}

function resetCalculator() {
  document.getElementById('billAmount').value = '';
  document.getElementById('tipPercent').value = '';
  document.getElementById('people').value = '';
  document.getElementById('tipAmount').textContent = '$0.00';
  document.getElementById('totalAmount').textContent = '$0.00';
  document.getElementById('totalBill').textContent = '$0.00';
}
