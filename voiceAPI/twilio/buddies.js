module.exports = {
    // maps of volunteer to caller
    buddiesMap: new Map(),
    namesMap: new Map(),

    addBuddyPair: function (volunteer, caller) {
        if (this.buddiesMap === undefined) {
            this.buddiesMap = new Map();
        }
        if (this.namesMap === undefined) {
            this.namesMap = new Map();
        }
        this.buddiesMap.set(volunteer.number, caller.number);
        this.namesMap.set(volunteer.number, volunteer.name);
        this.namesMap.set(caller.number, caller.name);
    },

    deleteBuddyPair: function (volunteer, caller) {
        if (this.buddiesMap === undefined) {
            this.buddiesMap = new Map();
        }
        if (this.namesMap === undefined) {
            this.namesMap = new Map();
        }
        this.buddiesMap.delete(volunteer);
        this.namesMap.delete(volunteer);
        this.namesMap.delete(caller);
    }
};
