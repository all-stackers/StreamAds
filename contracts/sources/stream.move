module CampaignManager {

    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp::{Self, Timestamp};

    struct Campaign has key, store {
        creator: address,
        media: vector<u8>,
        reward_timestamp: u64,
        pool_amount: Coin<AptosCoin>,
        participants: vector<(address, vector<u8>)>,
    }

    struct CampaignManager has key, store {
        campaigns: table::Table<u64, Campaign>,
        campaign_counter: u64,
    }

    public fun initialize(account: &signer) {
        move_to(account, CampaignManager {
            campaigns: table::Table::new<u64, Campaign>(),
            campaign_counter: 0,
        });
    }

    public fun create_campaign(
        account: &signer, 
        media: vector<u8>, 
        reward_timestamp: u64,
        pool_amount: u64
    ) {
        let creator_addr = signer::address_of(account);

        let manager = borrow_global_mut<CampaignManager>(creator_addr);
        let campaign_id = manager.campaign_counter;

        // Ensure the creator sends the correct pool amount
        let coin = Coin::withdraw(account, pool_amount);

        let campaign = Campaign {
            creator: creator_addr,
            media: media,
            reward_timestamp: reward_timestamp,
            pool_amount: coin,
            participants: vector::empty(),
        };

        table::add(&mut manager.campaigns, campaign_id, campaign);
        manager.campaign_counter = manager.campaign_counter + 1;
    }

    public fun add_participant(
        account: &signer, 
        campaign_id: u64, 
        instagram_post_id: vector<u8>
    ) {
        let manager = borrow_global_mut<CampaignManager>(signer::address_of(account));
        let campaign = table::borrow_mut(&mut manager.campaigns, campaign_id);

        vector::push_back(&mut campaign.participants, (signer::address_of(account), instagram_post_id));
    }

//    public fun distribute_rewards(account: &signer, campaign_id: u64) {
//     let manager = borrow_global_mut<CampaignManager>(signer::address_of(account));
//     let campaign = table::borrow_mut(&mut manager.campaigns, campaign_id);

//     // Check if the reward timestamp is reached
//     let current_time = Timestamp::now_seconds();
//     assert!(current_time >= campaign.reward_timestamp, 1);

//     let num_participants = vector::length(&campaign.participants);
//     assert!(num_participants > 0, 2);

//     let reward_per_participant = Coin::value(&campaign.pool_amount) / num_participants;

//     let i = 0;
//     while (i < num_participants) {
//         let (participant_address, _) = vector::borrow(&campaign.participants, i);
//         Coin::transfer(&mut campaign.pool_amount, participant_address, reward_per_participant);
//         i = i + 1;
//     }

//     // Reset pool amount after distribution
//     &campaign.pool_amount = Coin::zero();
// }

}
