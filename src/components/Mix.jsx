const Mix = () => {
    async function fetchTopTracks(timeRange, accessToken) {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch top tracks');
        }
      
        const data = await response.json();
        return data.items; // Return an array of top tracks
      }
      
      // Example usage
      const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with the user's access token
      const timeRanges = ['short_term', 'medium_term']; // 'short_term' for last month, 'medium_term' for last 6 months
      
      timeRanges.forEach(async (timeRange) => {
        try {
          const topTracks = await fetchTopTracks(timeRange, accessToken);
          console.log(`Top tracks for ${timeRange}:`, topTracks);
        } catch (error) {
          console.error('Error fetching top tracks:', error);
}})
return (<></>)
};
export default Mix;
