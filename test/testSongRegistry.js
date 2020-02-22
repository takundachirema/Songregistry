// import the contract artifact
const SongRegistry = artifacts.require('./SongRegistry.sol')
//const truffleAssert = require('truffle-assertions')

// test starts here
contract('SongRegistry', function (accounts) {
  // predefine the contract instance
  let SongRegistryInstance

  // before each test, create a new contract instance
  beforeEach(async function () {
    SongRegistryInstance = await SongRegistry.new()
  })

  // Test 1
  it('Checking that a song is correctly added to the registry', async function () {
      await SongRegistryInstance.register("Cool song", "example.com", 1, {'from': accounts[0]})
      let song = await SongRegistryInstance.songs(0)
      assert.equal(song.title, "Cool song", "Title has not been set correctly")
      assert.equal(song.owner, accounts[0], "Owner is not account 0")
  })

  // Test 2
  it('Checking that a song can be bought', async function () {
    await SongRegistryInstance.register("Cool song", "example.com", 1, {'from': accounts[0]})
    // Buy song with account 1
    await SongRegistryInstance.buy(0,{'from': accounts[1],'value': 1})
    let isBuyer = await SongRegistryInstance.isBuyer(0, {'from': accounts[1]})
    assert.equal(isBuyer, true, "Account 1 is not a buyer")
  })

  // Test 3
  it('Checking that number of songs increases with registration', async function () {
    await SongRegistryInstance.register("Song 1", "example.com", 1, {'from': accounts[0]})
    let count = await SongRegistryInstance.numberOfSongs()
    assert.equal(count, 1, "Number of songs not 1")
    // should be 2 after registration 2
    await SongRegistryInstance.register("Song 2", "example.com", 1, {'from': accounts[0]})
    count = await SongRegistryInstance.numberOfSongs()
    assert.equal(count, 2, "Number of songs not 2")
  })

  // Test 4
  it('Checking that only a true buyer is identified as such', async function () {
    await SongRegistryInstance.register("Cool song", "example.com", 1, {'from': accounts[0]})
    // Buy song with account 1
    await SongRegistryInstance.buy(0,{'from': accounts[1],'value': 1})
    // Check whether account 1 is a buyer
    let isBuyer = await SongRegistryInstance.isBuyer(0, {'from': accounts[1]})
    assert.equal(isBuyer, true, "Account 1 is not a buyer")
    // Check that account 2 is not a buyer
    isBuyer = await SongRegistryInstance.isBuyer(0, {'from': accounts[2]})
    assert.equal(isBuyer, false, "Account 2 is a buyer")
  })
})