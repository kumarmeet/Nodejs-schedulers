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

const monthDay = dates.map((date) => {
			return {
				month: moment(date).format("MMMM"),
				day: moment(date).format("dddd"),
			};
		});

		monthDay.map((dateMonth) => {
			if (input.upcoming_remainder) {
				cron.schedule(`* * * ${dateMonth.month} ${dateMonth.day}`, async () => {
					await this.source.model.notifications.firebaseNotification(
						"onAddVacc",
						user.id,
						{ month: dateMonth.month }
					);
				});
			}
		});
