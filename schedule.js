async isDateValid(input, user) {
		const { data } = input;

		moment.suppressDeprecationWarnings = true; //prevent warning by moment

		// const presentDate = moment("new Date()").format("YYYY-MM-DD")
		const presentDate = moment().format("YYYY-MM-DD");

		//comparison and check from present date to input date for vaccs
		const dates = data.map((d) => {
			let storedDates = moment(d.date).format("YYYY-MM-DD");
			let hasPreviousDate = moment(storedDates).isAfter(presentDate, "day");

			if (!hasPreviousDate) {
				throw new Error("Invalid Expiry Date");
			}

			return new Date(
				moment(storedDates).subtract(7, "d").format("YYYY-MM-DD")
			);
		});

		dates.map(async (date) => {
			const startTime = new Date(date + 1000);
			// const startTime = new Date(Date.now() + 1000);
			const endTime = new Date(startTime.getTime() + 1000);

			schedule.scheduleJob(
				{
					start: startTime,
					end: endTime,
					rule: "*/1 * * * * *",
				},
				async () => {
					console.log("Starting......");
					await this.source.model.notifications.firebaseNotification(
						"onAddVacc",
						user.id,
						{ date: moment(date).format("YYYY-MM-DD") }
					);
				}
			);
		});

		

		return true;
	}
