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
