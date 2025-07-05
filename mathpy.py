import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

# Sample data: 5 economic indicators across 10 Indian states
states = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala', 'Gujarat',
          'Punjab', 'West Bengal', 'Rajasthan', 'Bihar', 'Uttar Pradesh']
indicators = ["GDP", "Unemployment Rate", "Literacy Rate", "Poverty Rate", "Inflation Rate"]

# Generate random but plausible economic data
np.random.seed(42)
data = []
for indicator in indicators:
    for state in states:
        if indicator == "GDP":
            value = 250 + np.random.normal(loc=50, scale=20)
        elif indicator == "Unemployment Rate":
            value = 5 + np.random.normal(loc=1, scale=1)
        elif indicator == "Literacy Rate":
            value = 70 + np.random.normal(loc=5, scale=2)
        elif indicator == "Poverty Rate":
            value = 15 + np.random.normal(loc=5, scale=2.5)
        elif indicator == "Inflation Rate":
            value = 4 + np.random.normal(loc=1, scale=0.5)
        data.append([state, indicator, round(max(value, 0), 2)])

df = pd.DataFrame(data, columns=['State', 'Indicator', 'Value'])

# === Individual Graphs with Stats Displayed ===
summary = []

for indicator in indicators:
    sub_df = df[df['Indicator'] == indicator]
    values = sub_df['Value']

    # Calculate moments
    mean_val = values.mean()
    var_val = values.var()
    skew_val = skew(values)
    kurt_val = kurtosis(values)

    # Store summary
    summary.append({
        'Indicator': indicator,
        'Mean': round(mean_val, 2),
        'Variance': round(var_val, 2),
        'Skewness': round(skew_val, 2),
        'Kurtosis': round(kurt_val, 2)
    })

    # Plot
    plt.figure(figsize=(10, 5))
    sns.barplot(x='State', y='Value', data=sub_df, palette='viridis')
    plt.xticks(rotation=45)
    plt.title(f"{indicator}", fontsize=14)
    plt.xlabel('')
    plt.ylabel('')

    # Add text box with stats
    stats_text = f"Mean = {mean_val:.2f}\nVariance = {var_val:.2f}\nSkewness = {skew_val:.2f}\nKurtosis = {kurt_val:.2f}"
    plt.gcf().text(0.75, 0.6, stats_text, fontsize=10, bbox=dict(facecolor='lightyellow', edgecolor='black'))

    plt.tight_layout()
    plt.show()

# === Display Summary Table ===
summary_df = pd.DataFrame(summary)
print("\nStatistical Summary for Each Indicator:\n")
print(summary_df)