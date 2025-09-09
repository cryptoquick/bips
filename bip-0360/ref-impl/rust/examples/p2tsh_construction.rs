use p2tsh_ref::{create_p2tsh_utxo, create_p2tsh_multi_leaf_taptree};
use p2tsh_ref::data_structures::{UtxoReturn, TaptreeReturn, ConstructionReturn};
use std::env;
use log::{info, error};

// Inspired by:  https://learnmeabitcoin.com/technical/upgrades/taproot/#example-3-script-path-spend-signature
fn main() -> ConstructionReturn {

    let _ = env_logger::try_init(); // Use try_init to avoid reinitialization error

    // USE_PQC environment variable defaults to false if not set
    let use_pqc: bool = env::var("USE_PQC")
        .unwrap_or_else(|_| "false".to_string())
        .parse()
        .unwrap_or(false);
    info!("use_pqc: {}", use_pqc);

    let taptree_return: TaptreeReturn = create_p2tsh_multi_leaf_taptree(use_pqc);
    let p2tsh_utxo_return: UtxoReturn = create_p2tsh_utxo(taptree_return.clone().tree_root_hex);

    return ConstructionReturn {
        taptree_return: taptree_return,
        utxo_return: p2tsh_utxo_return,
    };
}
