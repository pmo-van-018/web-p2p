export default ({ app }, inject) => {
  inject('checkLighthouseBot', () => {
    let isLighthouseBot = false
    try {
      isLighthouseBot = JSON.stringify(window.clientInformation.userAgentData).includes('Lighthouse')
    } catch (error) {}
    return isLighthouseBot
  })
}
