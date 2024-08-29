module kenil::stream {

   
    use std::string;
    use std::vector;
    use std::option;
    use std::signer;


    struct Campaign has copy, drop, store {
        creator: address,
        media: string::String,
        pool_amount: u64,
        participants: vector<Participant>,
        rewards_distributed: bool,
    }

    struct Participant has copy, drop,store {
        participant_address: address,
        instagram_post_id: string::String,
    }

    // Store campaigns with unique ids
     struct CampaignManager has key {
        campaigns: vector<Campaign>,
        campaign_counter: u64,
    }

    public fun create_campaign(
        sig: &signer,
        media: string::String,
        pool_amount: u64,
    ) acquires CampaignManager{
        let manager = borrow_global_mut<CampaignManager>(signer::address_of(sig));
        assert!(pool_amount > 0, 1); // Pool amount must be greater than 0

        let new_campaign = Campaign {
            creator: signer::address_of(sig),
            media,
            pool_amount,
            participants: vector::empty<Participant>(),
            rewards_distributed: false,
        };

        vector::push_back(&mut manager.campaigns, new_campaign);
        manager.campaign_counter = manager.campaign_counter + 1;
    }

    public fun add_participant(
        campaign_id: u64,
        instagram_post_id: string::String,
        sig: &signer,
    ) acquires CampaignManager{
        let manager = borrow_global_mut<CampaignManager>(signer::address_of(sig));
        let campaign = vector::borrow_mut(&mut manager.campaigns, campaign_id);
        let participant = Participant {
            participant_address: signer::address_of(sig),
            instagram_post_id,
        };
        vector::push_back(&mut campaign.participants, participant);
    }

    public fun distribute_rewards(campaign_id: u64, sig:&signer) acquires CampaignManager{
        let manager = borrow_global_mut<CampaignManager>(signer::address_of(sig));
        let campaign =  vector::borrow_mut(&mut manager.campaigns, campaign_id);

        assert!(!campaign.rewards_distributed, 2); // Rewards already distributed

        let num_participants = vector::length(&campaign.participants);
        assert!(num_participants > 0, 3); // No participants to distribute rewards to

        let reward_per_participant = campaign.pool_amount / num_participants;
        for (i in 0..num_participants) {
            let participant = vector::borrow(&campaign.participants,i);
            
            // Transfer reward logic is not directly supported in Move, assume external function for simplicity
            // external_transfer(participant.participant_address, reward_per_participant);
        };

        campaign.rewards_distributed = true;
    }

    public fun get_campaign(campaign_id: u64, sig:&signer): (address, string::String, u64, u64, bool) acquires CampaignManager {
        let manager = borrow_global_mut<CampaignManager>(signer::address_of(sig));
        let campaign = vector::borrow(&manager.campaigns, campaign_id);
        (
            campaign.creator,
            campaign.media,
            campaign.pool_amount,
            vector::length(&campaign.participants),
            campaign.rewards_distributed,
        )
    }

     fun init_module(sig:&signer) {
        let manager = CampaignManager {
            campaigns: vector::empty<Campaign>(),
            campaign_counter: 0,
        };
        move_to<CampaignManager>(sig,manager);
    }
}
