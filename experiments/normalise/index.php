<!doctype html>
<html>
<head>
	<script src="../../src/dependencies/jquery.js"></script>
    <script>
        <?php
        $word = '
            <div contenteditable="true" class="lc"><!--[if gte mso 9]><xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            </o:OfficeDocumentSettings>
            </xml><![endif]--><!--[if gte mso 9]><xml>
            <w:WordDocument>
            <w:View>Normal</w:View>
            <w:Zoom>0</w:Zoom>
            <w:TrackMoves/>
            <w:TrackFormatting/>
            <w:PunctuationKerning/>
            <w:ValidateAgainstSchemas/>
            <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
            <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
            <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
            <w:DoNotPromoteQF/>
            <w:LidThemeOther>EN-NZ</w:LidThemeOther>
            <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
            <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
            <w:Compatibility>
            <w:BreakWrappedTables/>
            <w:SnapToGridInCell/>
            <w:WrapTextWithPunct/>
            <w:UseAsianBreakRules/>
            <w:DontGrowAutofit/>
            <w:SplitPgBreakAndParaMark/>
            <w:EnableOpenTypeKerning/>
            <w:DontFlipMirrorIndents/>
            <w:OverrideTableStyleHps/>
            </w:Compatibility>
            <m:mathPr>
            <m:mathFont m:val="Cambria Math"/>
            <m:brkBin m:val="before"/>
            <m:brkBinSub m:val="&#45;-"/>
            <m:smallFrac m:val="off"/>
            <m:dispDef/>
            <m:lMargin m:val="0"/>
            <m:rMargin m:val="0"/>
            <m:defJc m:val="centerGroup"/>
            <m:wrapIndent m:val="1440"/>
            <m:intLim m:val="subSup"/>
            <m:naryLim m:val="undOvr"/>
            </m:mathPr></w:WordDocument>
            </xml><![endif]--><!--[if gte mso 9]><xml>
            <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="true"
            DefSemiHidden="true" DefQFormat="false" DefPriority="99"
            LatentStyleCount="267">
            <w:LsdException Locked="false" Priority="0" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Normal"/>
            <w:LsdException Locked="false" Priority="9" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="heading 1"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 2"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 3"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 4"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 5"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 6"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 7"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 8"/>
            <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 9"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 1"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 2"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 3"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 4"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 5"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 6"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 7"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 8"/>
            <w:LsdException Locked="false" Priority="39" Name="toc 9"/>
            <w:LsdException Locked="false" Priority="35" QFormat="true" Name="caption"/>
            <w:LsdException Locked="false" Priority="10" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Title"/>
            <w:LsdException Locked="false" Priority="1" Name="Default Paragraph Font"/>
            <w:LsdException Locked="false" Priority="11" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Subtitle"/>
            <w:LsdException Locked="false" Priority="22" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Strong"/>
            <w:LsdException Locked="false" Priority="20" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Emphasis"/>
            <w:LsdException Locked="false" Priority="59" SemiHidden="false"
            UnhideWhenUsed="false" Name="Table Grid"/>
            <w:LsdException Locked="false" UnhideWhenUsed="false" Name="Placeholder Text"/>
            <w:LsdException Locked="false" Priority="1" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="No Spacing"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 1"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 1"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 1"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 1"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 1"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 1"/>
            <w:LsdException Locked="false" UnhideWhenUsed="false" Name="Revision"/>
            <w:LsdException Locked="false" Priority="34" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="List Paragraph"/>
            <w:LsdException Locked="false" Priority="29" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Quote"/>
            <w:LsdException Locked="false" Priority="30" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Intense Quote"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 1"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 1"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 1"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 1"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 1"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 1"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 1"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 1"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 2"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 2"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 2"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 2"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 2"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 2"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 2"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 2"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 2"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 2"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 2"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 2"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 2"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 2"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 3"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 3"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 3"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 3"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 3"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 3"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 3"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 3"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 3"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 3"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 3"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 3"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 3"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 3"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 4"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 4"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 4"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 4"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 4"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 4"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 4"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 4"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 4"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 4"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 4"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 4"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 4"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 4"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 5"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 5"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 5"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 5"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 5"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 5"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 5"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 5"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 5"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 5"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 5"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 5"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 5"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 5"/>
            <w:LsdException Locked="false" Priority="60" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Shading Accent 6"/>
            <w:LsdException Locked="false" Priority="61" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light List Accent 6"/>
            <w:LsdException Locked="false" Priority="62" SemiHidden="false"
            UnhideWhenUsed="false" Name="Light Grid Accent 6"/>
            <w:LsdException Locked="false" Priority="63" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 1 Accent 6"/>
            <w:LsdException Locked="false" Priority="64" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Shading 2 Accent 6"/>
            <w:LsdException Locked="false" Priority="65" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 1 Accent 6"/>
            <w:LsdException Locked="false" Priority="66" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium List 2 Accent 6"/>
            <w:LsdException Locked="false" Priority="67" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 1 Accent 6"/>
            <w:LsdException Locked="false" Priority="68" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 2 Accent 6"/>
            <w:LsdException Locked="false" Priority="69" SemiHidden="false"
            UnhideWhenUsed="false" Name="Medium Grid 3 Accent 6"/>
            <w:LsdException Locked="false" Priority="70" SemiHidden="false"
            UnhideWhenUsed="false" Name="Dark List Accent 6"/>
            <w:LsdException Locked="false" Priority="71" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Shading Accent 6"/>
            <w:LsdException Locked="false" Priority="72" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful List Accent 6"/>
            <w:LsdException Locked="false" Priority="73" SemiHidden="false"
            UnhideWhenUsed="false" Name="Colorful Grid Accent 6"/>
            <w:LsdException Locked="false" Priority="19" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Subtle Emphasis"/>
            <w:LsdException Locked="false" Priority="21" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Intense Emphasis"/>
            <w:LsdException Locked="false" Priority="31" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Subtle Reference"/>
            <w:LsdException Locked="false" Priority="32" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Intense Reference"/>
            <w:LsdException Locked="false" Priority="33" SemiHidden="false"
            UnhideWhenUsed="false" QFormat="true" Name="Book Title"/>
            <w:LsdException Locked="false" Priority="37" Name="Bibliography"/>
            <w:LsdException Locked="false" Priority="39" QFormat="true" Name="TOC Heading"/>
            </w:LatentStyles>
            </xml><![endif]--><!--[if gte mso 10]>
            <style>
            /* Style Definitions */
            table.MsoNormalTable
                {mso-style-name:"Table Normal";
                mso-tstyle-rowband-size:0;
                mso-tstyle-colband-size:0;
                mso-style-noshow:yes;
                mso-style-priority:99;
                mso-style-parent:"";
                mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
                mso-para-margin-top:0cm;
                mso-para-margin-right:0cm;
                mso-para-margin-bottom:10.0pt;
                mso-para-margin-left:0cm;
                line-height:115%;
                mso-pagination:widow-orphan;
                font-size:11.0pt;
                font-family:"Calibri","sans-serif";
                mso-ascii-font-family:Calibri;
                mso-ascii-theme-font:minor-latin;
                mso-hansi-font-family:Calibri;
                mso-hansi-theme-font:minor-latin;
                mso-bidi-font-family:"Times New Roman";
                mso-bidi-theme-font:minor-bidi;
                mso-fareast-language:EN-US;}
            </style>
            <![endif]-->

            <h1 _moz_dirty=""><strong><i style="mso-bidi-font-style:normal"><u><span style="font-size:
            16.0pt;mso-bidi-font-size:14.0pt;line-height:115%;font-family:&quot;Cambria&quot;,&quot;serif&quot;;
            mso-ascii-theme-font:major-latin;mso-hansi-theme-font:major-latin;mso-bidi-font-family:
            &quot;Times New Roman&quot;;mso-bidi-theme-font:major-bidi;mso-bidi-font-weight:normal">Lorem
            Ipsum</span></u></i></strong></h1>

            <p class="MsoNormal" _moz_dirty=""><strong><span style="font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;
            mso-ascii-theme-font:minor-latin;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:
            &quot;Times New Roman&quot;;mso-bidi-theme-font:minor-bidi">Lorem Ipsum</span></strong>
            is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industrys <span style="font-family:&quot;Courier New&quot;">standard dummy text
            ever since the 1500s</span>, when an unknown printer took a galley of type and
            scrambled it to <sup>make</sup> a type specimen book.</p>

            <p style="margin-left:36.0pt;text-align:justify" class="MsoNormal" _moz_dirty=""><span style="mso-spacerun:yes">&nbsp;</span>It has survived not only five <span style="font-size:14.0pt;mso-bidi-font-size:11.0pt;line-height:115%">centuries</span>,
            but also the <span style="font-size:9.0pt;mso-bidi-font-size:11.0pt;line-height:
            115%">leap </span>into electronic <b style="mso-bidi-font-weight:normal">typesetting,
            <i style="mso-bidi-font-style:normal">remaining</i> essentially</b> unchanged.
            It was popularised in the 1960s with the release of Letraset sheets containing
            Lorem <b style="mso-bidi-font-weight:normal">Ipsum</b> passages, and more
            recently with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.</p>

            <p style="margin-left:72.0pt;mso-add-space:
            auto;text-align:justify;text-indent:-18.0pt;mso-list:l0 level1 lfo1" class="MsoListParagraphCxSpFirst" _moz_dirty=""><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
            Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span>This is some pretty terable content</p>

            <p style="margin-left:72.0pt;mso-add-space:
            auto;text-align:justify;text-indent:-18.0pt;mso-list:l0 level1 lfo1" class="MsoListParagraphCxSpMiddle" _moz_dirty=""><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
            Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span></span></span>This is some pretty terable content</p>

            <p style="margin-left:108.0pt;mso-add-space:
            auto;text-align:justify;text-indent:-18.0pt;mso-list:l0 level2 lfo1" class="MsoListParagraphCxSpLast" _moz_dirty=""><span style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp;&nbsp;
            </span></span></span>Really</p>

            <div style="mso-element:para-border-div;border:none;border-bottom:solid #4F81BD 1.0pt;
            mso-border-bottom-themecolor:accent1;mso-border-bottom-alt:solid #4F81BD .5pt;
            mso-border-bottom-themecolor:accent1;padding:0cm 0cm 4.0pt 0cm;margin-left:
            46.8pt;margin-right:46.8pt" _moz_dirty="">

            <p style="margin-top:10.0pt;margin-right:0cm;margin-bottom:
            14.0pt;margin-left:0cm" class="MsoIntenseQuote"><span style="color:#FCFCFD;mso-themecolor:accent1;
            mso-themetint:7;mso-style-textfill-fill-color:#FCFCFD;mso-style-textfill-fill-themecolor:
            accent1;mso-style-textfill-fill-alpha:95.0%;mso-style-textfill-fill-colortransforms:
            tint=3000;letter-spacing:.5pt;background:green;mso-highlight:green;mso-style-textoutline-type:
            solid;mso-style-textoutline-fill-color:#06111E;mso-style-textoutline-fill-themecolor:
            accent1;mso-style-textoutline-fill-alpha:6.5%;mso-style-textoutline-fill-colortransforms:
            shade=2500;mso-style-textoutline-outlinestyle-dpiwidth:.531pt;mso-style-textoutline-outlinestyle-linecap:
            flat;mso-style-textoutline-outlinestyle-join:round;mso-style-textoutline-outlinestyle-pctmiterlimit:
            0%;mso-style-textoutline-outlinestyle-dash:solid;mso-style-textoutline-outlinestyle-align:
            center;mso-style-textoutline-outlinestyle-compound:simple;mso-effects-shadow-color:
            black;mso-effects-shadow-alpha:60.0%;mso-effects-shadow-dpiradius:4.008pt;
            mso-effects-shadow-dpidistance:3.031pt;mso-effects-shadow-angledirection:13500000;
            mso-effects-shadow-align:none;mso-effects-shadow-pctsx:0%;mso-effects-shadow-pctsy:
            0%;mso-effects-shadow-anglekx:0;mso-effects-shadow-angleky:0"><span style="color:windowtext">The end</span></span><span style="color:#FCFCFD;
            mso-themecolor:accent1;mso-themetint:7;mso-style-textfill-fill-color:#FCFCFD;
            mso-style-textfill-fill-themecolor:accent1;mso-style-textfill-fill-alpha:95.0%;
            mso-style-textfill-fill-colortransforms:tint=3000;letter-spacing:.5pt;
            mso-style-textoutline-type:solid;mso-style-textoutline-fill-color:#06111E;
            mso-style-textoutline-fill-themecolor:accent1;mso-style-textoutline-fill-alpha:
            6.5%;mso-style-textoutline-fill-colortransforms:shade=2500;mso-style-textoutline-outlinestyle-dpiwidth:
            .531pt;mso-style-textoutline-outlinestyle-linecap:flat;mso-style-textoutline-outlinestyle-join:
            round;mso-style-textoutline-outlinestyle-pctmiterlimit:0%;mso-style-textoutline-outlinestyle-dash:
            solid;mso-style-textoutline-outlinestyle-align:center;mso-style-textoutline-outlinestyle-compound:
            simple;mso-effects-shadow-color:black;mso-effects-shadow-alpha:60.0%;
            mso-effects-shadow-dpiradius:4.008pt;mso-effects-shadow-dpidistance:3.031pt;
            mso-effects-shadow-angledirection:13500000;mso-effects-shadow-align:none;
            mso-effects-shadow-pctsx:0%;mso-effects-shadow-pctsy:0%;mso-effects-shadow-anglekx:
            0;mso-effects-shadow-angleky:0"></span></p>
            </div>
            </div>
        ';
        $basic = '
            <div>
                <h1><small>This is a messy <big>heading</big></small></h1>
                <div>
                    <p>With some <span>paragraphs</span>! Can I haz a <a href=".">link</a> plz?</p>
                </div>
            </div>
        ';
        ?>
        var word = <?php echo json_encode($word); ?>;
        var basic = <?php echo json_encode($basic); ?>;
        jQuery.fn.removeAttributes = function() {
            return this.each(function() {
                var attributes = $.map(this.attributes, function(item) {
                    return item.name;
                });
                var element = $(this);
                $.each(attributes, function(i, item) {
                    element.removeAttr(item);
                });
            });
        }
        function removeComments(parent) {
            parent.contents().each(function() {
                if (this.nodeType == 8) {
                    $(this).remove()
                }
            });
            parent.children().each(function() {
                removeComments($(this));
            });
            return parent;
        }

        function removeAttributes(parent) {
            parent.children().each(function() {
                var attributes = $.map(this.attributes, function(item) {
                    if (item.name != 'href') {
                        return item.name;
                    }
                });
                var element = $(this);
                $.each(attributes, function(i, item) {
                    element.removeAttr(item);
                });
                removeAttributes($(this));
            });
            return parent;
        }

        function filterChildren(parent) {
            parent.children().each(function() {
                filterChildren($(this));
                if (!$(this).is('h1, h2, h3, p, a, ul, ol, li')) {
                    $(this).replaceWith($(this).html());
                }
            });
            return parent;
        }

        function replaceNBSP(parent) {
            parent.html(parent.html().replace(/&nbsp;/g, ' '));
            return parent;
        }

        function replaceNonAscii(parent) {
            parent.html(parent.html().replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, ''));
            return parent;
        }

        function replaceDoubleSpace(parent) {
            parent.html(parent.html().replace(/\s{2,}/g, ' '));
            return parent;
        }

        function replaceEmptyElements(parent) {
            parent.children().each(function() {
                replaceEmptyElements($(this));
                if ($.trim($(this).html()) == '') {
                    $(this).remove();
                }
            });
            return parent;
        }

        function normaliseContent(content) {
            var result = $('<div/>').append($(content));
            result = removeComments(result);
            result = removeAttributes(result);
            result = filterChildren(result);
            result = replaceNBSP(result);
            result = replaceNonAscii(result);
            result = replaceDoubleSpace(result);
            result = replaceEmptyElements(result);
            console.log(result);
            return result.html();
        }

        jQuery(function() {
            $('<div/>').append(normaliseContent(basic)).appendTo('body');
            $('<textarea/>').val(normaliseContent(basic)).appendTo('body');
            $('<div/>').append(normaliseContent(word)).appendTo('body');
            $('<textarea/>').val(normaliseContent(word)).appendTo('body');
        });
    </script>
    <style type="text/css">
        textarea {
            width: 100%;
            height: 300px;
        }
    </style>
</head>
<body>
</body>
</html>
