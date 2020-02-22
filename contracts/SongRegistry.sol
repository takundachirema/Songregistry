pragma solidity >=0.5.0;

contract SongRegistry {

    struct Song {
        string title;
        string url;
        address payable owner;
        uint price;
    }

    Song[] public songs;
    mapping(uint => address[]) buyers;

    // Pass the memory keyword so that space is reserved in memory
    // String is variable length.
    function register(string memory title, string memory url, uint price) public {
        Song memory song = Song(title, url, msg.sender, price);
        songs.push(song);
        buyers[songs.length - 1].push(msg.sender);
    }

    function numberOfSongs() public view returns(uint) {
        return songs.length;
    }

    function isBuyer(uint songId) public view returns(bool) {
        address[] storage songBuyers = buyers[songId];
        bool buyer;
        for (uint i; i < songBuyers.length; i++){
            if (songBuyers[i] == msg.sender){
                buyer = true;
                break;
            }
        }
        return buyer;
    }

    function buy(uint songId) public payable {
        Song storage song = songs[songId];
        require(msg.value == song.price, "value does not match price");
        buyers[songId].push(msg.sender);
        address(uint160(song.owner)).transfer(msg.value);
    }
}