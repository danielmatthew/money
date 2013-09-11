	var money = {
		lsIncomeValue: localStorage.getItem('money.income'),
		stored: JSON.parse(localStorage.getItem('money.records')),
		income: document.querySelector('[name="income"]'),
		item: document.querySelector('[name="outgoing-item"]'),
		records: [],
		incomeValue: 0,
		netValue: 0,

		init: function() {
			this.addEventListeners();
			console.log('Initialized!');
			console.log(money.stored, parseInt(money.lsIncomeValue, 10));

			// Push local storage into records array for later use; prevents bein
			// overridden when adding new one
			if (this.stored) {
				for (var i = 0; i < money.stored.length; i++) {
					money.records.push(money.stored[i]);
				};
			}

			if (this.lsIncomeValue) {
				this.incomeValue = parseInt(money.lsIncomeValue, 10);
			}

			document.querySelector('[name="incoming-name"]').value = this.incomeValue;


			this.render();
		},

		render: function() {
			this.drawOutgoings();
			this.drawTotalOutgoings(this.sumOutgoings());
			this.drawTotalIncome(this.incomeValue);

			this.drawNet(this.calculateNet(this.incomeValue, this.sumOutgoings()));


		},

		addEventListeners: function() {
			this.item.addEventListener('submit', this.addOutgoing, false);
			this.income.addEventListener('submit', this.addIncome, false);
			console.log('Event listeners added');
		},

		addIncome: function(e) {
			e.preventDefault();
			e.stopPropagation();

			money.incomeValue = parseInt(document.querySelector('[name="incoming-name"]').value, 10);
			localStorage.setItem('money.income', money.incomeValue);

			money.render();
		},

		addOutgoing: function(e) {
			e.preventDefault();
			e.stopPropagation();

			var outgoingItem = {
					name: money.item.querySelector('[name="outgoing-name"]').value,
					cost: money.item.querySelector('[name="outgoing-cost"]').value
				};

			money.records.push(outgoingItem);

			// Clear form values
			var inputs = money.item.querySelectorAll('[name^="outgoing-"]');
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].value = '';
			};

			localStorage.setItem('money.records', JSON.stringify(money.records));
			console.log(money.records);
		},

		drawOutgoings: function() {
			var outgoings = document.getElementById('outgoings'),
				records = money.records,
				itemList = document.createDocumentFragment();

			for (var i = 0; i < records.length; i++) {			
				var item = document.createElement('li');
				item.textContent = records[i].name + ' - ' + records[i].cost;
				itemList.appendChild(item);
			}

			outgoings.appendChild(itemList);
		},

		sumOutgoings: function() {
			var total = 0;

			for (var i = 0; i < money.records.length; i++) {
				total += parseInt(money.records[i].cost, 10);
			};

			return total;
		},

		drawTotalOutgoings: function(data) {
			var total = document.getElementById('computed-total');
			total.textContent = data;
		},

		drawTotalIncome: function(data) {
			var total = document.getElementById('computed-income');
			total.textContent = data;
		},

		calculateNet: function(income, outgoings) {
			var net = income - outgoings;

			return net;
		},

		drawNet: function(data) {
			var total = document.getElementById('computed-net');
			total.textContent = data;
		}
	};

	money.init();