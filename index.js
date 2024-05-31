const slider = document.querySelector('.slider');
const body = document.querySelector('body');

// Toggle dark mode
slider.onclick = () => {
  body.classList.toggle('dark-mode');
};

// Function to fetch data and update the DOM
async function fetchDataAndDisplay() {
  try {
    const response = await fetch('db.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    // Debug log to check the structure of the data
    console.log('Fetched data:', data);

    // Update header title and total followers
    document.querySelector('.title h2').textContent = "Social Media Dashboard";
    document.querySelector('.title p').textContent = `Total Followers: ${data.totalFollowers}`;

    // Update the stats cards
    data.socialMediaAccounts.forEach((account, index) => {
      const statCard = document.querySelectorAll('.stat-card')[index];
      if (statCard) {
        statCard.querySelector('.intro p').textContent = account.username;
        statCard.querySelector('h1').textContent = account.followers || account.subscribers;
        statCard.querySelector('.followers').textContent = account.followers ? 'Followers' : 'Subscribers';
        const changeElement = statCard.querySelector('.change');
        changeElement.querySelector('p').textContent = `${Math.abs(account.changeToday)} Today`;

        // Update the change icon and class based on positive or negative change
        const changeImg = changeElement.querySelector('img');
        if (account.changeToday < 0) {
          changeImg.src = './images/icon-down.svg';
          changeElement.querySelector('p').classList.add('negative');
          changeElement.querySelector('p').classList.remove('positive');
        } else {
          changeImg.src = './images/icon-up.svg';
          changeElement.querySelector('p').classList.add('positive');
          changeElement.querySelector('p').classList.remove('negative');
        }
      }
    });

    // Update overview title
    document.querySelector('.profile h2').textContent = "Overview - Today";

    // Flatten the overview data
    const overviewData = data.socialMediaAccounts.flatMap(account => {
      return Object.entries(account.statsToday).map(([key, value]) => {
        return { platform: account.platform, statName: key, statValue: value.value, statChange: value.change };
      });
    });

    // Loop through the overview stats and update them
    document.querySelectorAll('.overview-card').forEach((overviewCard, index) => {
      const stat = overviewData[index];
      if (stat) {
        overviewCard.querySelector('.section1 p').textContent = stat.statName;
        overviewCard.querySelector('.section2 h2').textContent = stat.statValue;
        const changeElement = overviewCard.querySelector('.change');
        changeElement.querySelector('p').textContent = `${Math.abs(stat.statChange)}%`;

        // Update the change icon and class based on positive or negative change
        const changeImg = changeElement.querySelector('img');
        if (stat.statChange < 0) {
          changeImg.src = './images/icon-down.svg';
          changeElement.querySelector('p').classList.add('negative');
          changeElement.querySelector('p').classList.remove('positive');
        } else {
          changeImg.src = './images/icon-up.svg';
          changeElement.querySelector('p').classList.add('positive');
          changeElement.querySelector('p').classList.remove('negative');
        }
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the function to fetch data and update the DOM
fetchDataAndDisplay();
