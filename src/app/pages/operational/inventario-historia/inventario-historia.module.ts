
export interface InventarioHistoria{
    id: number,
    date: Date,
    amount: number,
    measure: number,
    transactionType: string,
    UserId:number,
    InventorySuppliesId:number
}








/**
 * public class InventoryRecords  : ABaseModel
{
    public double Amount {  get; set; }
    public double Measure { get; set; }
    public string TransactionType { get; set; }
    public int UsersId { get; set; }
    public Users Users { get; set; }
    public int InventorySuppliesId { get; set; }
    public InventorySupplies InventorySupplies { get; set; }
 */
/**
 * 
        public int Amount { get; set; }
        public string Measure {  get; set; }
        public int InventoryId { get; set; }
        public Inventories Inventory { get; set; }
        public int SuppliesId { get; set; }
        public Supplies Supplies { get; set; }

    }
 */
    