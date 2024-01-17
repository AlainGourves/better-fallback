const FakeLoading = async function() {

  // Fake delay to see Loading component
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return (
    <p>On attend...</p>
  )
}

export default FakeLoading;